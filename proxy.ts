import { NextResponse, type NextRequest } from 'next/server'

import { LOCALES, DEFAULT_LOCALE } from 'src/i18n/config'

const PREFIXED = LOCALES.filter((locale) => locale !== DEFAULT_LOCALE)

/**
 * Cesty už převedené do app/[lang]/. Dokud běží obě routovací vrstvy
 * vedle sebe, přepisuje se jen to, co v App Routeru skutečně existuje —
 * jinak by requesty na stránky ve `pages/` končily 404.
 *
 * Při dokončení migrace se seznam zruší a přepisuje se všechno.
 */
const MIGRATED: string[] = []

/**
 * Mapuje veřejné adresy na interní segment [lang].
 *
 * Slovenština zůstává bez prefixu, takže /news se interně přepíše
 * na /sk/news. Používá se rewrite, ne redirect — adresa v prohlížeči
 * i ve výsledcích vyhledávání zůstává beze změny a existující odkazy
 * na web nepotřebují 301.
 *
 * Ostatní jazyky prefix mají (/en/news) a propouštějí se beze změny.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const hasPrefix = PREFIXED.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  )

  if (hasPrefix) {
    return NextResponse.next()
  }

  const isMigrated = MIGRATED.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )

  if (!isMigrated) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = `/${DEFAULT_LOCALE}${pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  // Statická aktiva, API a proxy na CMS se nepřepisují.
  matcher: ['/((?!_next|cms|api|images|favicon.ico|robots.txt|sitemap.xml).*)'],
}
