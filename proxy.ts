import { NextResponse, type NextRequest } from 'next/server'

import { LOCALES, DEFAULT_LOCALE } from 'src/i18n/config'

const PREFIXED = LOCALES.filter((locale) => locale !== DEFAULT_LOCALE)

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

  // Proxy na Strapi. Dřív to řešily `rewrites` v next.config.js, jenže
  // standalone build je zapéká do server.js už při buildu — adresa CMS
  // v nich zůstala na výchozí 0.0.0.0:1337 a požadavky končily
  // na ECONNREFUSED. Middleware se vyhodnocuje za běhu, takže proměnnou
  // přečte správně.
  if (pathname.startsWith('/cms/')) {
    const target =
      process.env.API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://0.0.0.0:1337'

    const url = new URL(
      pathname.replace(/^\/cms/, '') + request.nextUrl.search,
      target
    )
    return NextResponse.rewrite(url)
  }

  const hasPrefix = PREFIXED.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  )

  if (hasPrefix) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = `/${DEFAULT_LOCALE}${pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  // Nepřepisují se interní cesty Nextu, API, proxy na CMS ani soubory
  // z public/. Ty se poznají podle přípony — vyjmenovávat složky ručně
  // je křehké: chyběly tam fonts/ i icons/ a prohlížeč pak na ně
  // dostával 404.
  // /cms se nově zpracovává uvnitř middleware, takže z matcheru
  // vyjmutý být nesmí. Statické soubory se poznají podle přípony.
  matcher: ['/((?!_next|api).*)'],
}
