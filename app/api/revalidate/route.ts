import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

import { LOCALES } from 'src/i18n/config'

/**
 * Přegeneruje stránku na vyžádání, typicky po uložení obsahu v CMS.
 *
 * Bez toho se stránky obnovují jen podle času (`revalidate`), takže se
 * změna z administrace projeví nejdřív za pět minut — a to až poté, co
 * někdo stránku navštíví. Na stránku, kam nikdo nechodí, se nedostane
 * vůbec. Pro redakční práci je to málo: editor uloží text, podívá se
 * na web a nic tam není.
 *
 * Strapi sem po uložení pošle webhook a stránka se přegeneruje během
 * několika vteřin.
 *
 * Volá se POST s tajemstvím v hlavičce:
 *
 *   curl -X POST https://web.uat.sk/api/revalidate \
 *        -H "x-revalidate-secret: $REVALIDATE_SECRET" \
 *        -H "content-type: application/json" \
 *        -d '{"model":"page","entry":{"slug":"zajazdy"}}'
 */

/** Endpoint nesmí mít vlastní cache — musí se vyhodnotit při každém volání. */
export const dynamic = 'force-dynamic'

/**
 * Značka pro „obnov celý layout".
 *
 * Menu a patička se vykreslují v layoutu, takže jejich změna se týká
 * všech stránek. revalidatePath s type 'layout' obnoví layout i vše
 * pod ním; jednotlivé cesty by se vypisovat nedaly, je jich přes tisíc.
 */
const ROOT_LAYOUT = '__layout__'

/**
 * Z jakého modelu Strapi vznikne která cesta na webu.
 *
 * Klíč je `model` z webhooku — Strapi posílá `singularName` ze schématu.
 * Názvy odpovídají schématům v admin-v4-ts (singularName),
 * ne odhadu podle jmen na webu.
 *
 * Neznámý model obnoví úvodní stránku: obsah se objevuje i tam a je
 * lepší obnovit navíc než nechat starou verzi.
 */
const PATHS: Record<string, (entry: Record<string, any>) => string[]> = {
  // Detail + přehled, protože se záznam objevuje v obou.
  page: (e) => (e.slug ? [`/pages/${e.slug}`] : []),
  'news-entry': (e) => (e.slug ? [`/news/${e.slug}`, '/news', '/'] : ['/news']),
  festival: (e) => (e.id ? [`/festivals/${e.id}`] : []),
  'field-of-study': (e) => (e.id ? [`/studies/${e.id}`, '/'] : ['/']),
  'gallery-event': (e) =>
    e.id ? [`/events/${e.id}`, '/galleries'] : ['/galleries'],
  'gallery-uat': () => ['/galleries', '/'],

  // Jediný záznam pro celý web.
  homepage: () => ['/'],
  'about-school': () => ['/about-school'],
  gallery: () => ['/galleries'],
  teacher: () => ['/teachers', '/'],

  // Menu a patička jsou v layoutu, takže se týkají všech stránek.
  // ROOT_LAYOUT obnoví layout včetně vnořených stránek.
  footer: () => [ROOT_LAYOUT],
  'footer-section': () => [ROOT_LAYOUT],
  'menu-school': () => [ROOT_LAYOUT],
  'menu-student': () => [ROOT_LAYOUT],
  'menu-applicant': () => [ROOT_LAYOUT],
  'menu-festival': () => [ROOT_LAYOUT],
}

/**
 * Doplní jazykové varianty.
 *
 * V cache leží každá stránka pod jazykovým prefixem (/sk/news, /en/news) —
 * i slovenština, přestože se v adrese návštěvníkovi neukazuje: middleware
 * na ni přepisuje veřejné /news. Revalidovat jen cestu bez prefixu proto
 * nestačí, žádný takový záznam v cache není.
 */
function withLocales(path: string): string[] {
  const prefixed = LOCALES.map(
    (locale) => `/${locale}${path === '/' ? '' : path}`
  )

  // Cesta bez prefixu se přidává taky: v cache sice obvykle není,
  // ale revalidace neexistujícího záznamu nic nestojí a pokryje to
  // případ, kdy se stránka uloží pod veřejnou adresou.
  return [...prefixed, path]
}

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET

  // Bez nastaveného tajemství by endpoint mohl vyvolat kdokoli
  // a opakovaným voláním zatížit CMS.
  if (!secret) {
    return NextResponse.json(
      { error: 'REVALIDATE_SECRET není nastavené' },
      { status: 503 }
    )
  }

  if (request.headers.get('x-revalidate-secret') !== secret) {
    return NextResponse.json({ error: 'Neplatné tajemství' }, { status: 401 })
  }

  let body: { model?: string; entry?: Record<string, any>; path?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Očekává se JSON' }, { status: 400 })
  }

  // Konkrétní cesta má přednost — hodí se pro ruční vyvolání.
  const paths = body.path
    ? [body.path]
    : PATHS[body.model ?? '']?.(body.entry ?? {}) ?? ['/']

  // Layout se obnovuje jako celek, ne po jazycích — type 'layout'
  // zahrne i všechny stránky pod ním.
  if (paths.includes(ROOT_LAYOUT)) {
    revalidatePath('/', 'layout')

    return NextResponse.json({
      revalidated: ['/ (layout a vše pod ním)'],
      at: new Date().toISOString(),
    })
  }

  const revalidated = paths.flatMap(withLocales)
  revalidated.forEach((path) => revalidatePath(path))

  return NextResponse.json({ revalidated, at: new Date().toISOString() })
}
