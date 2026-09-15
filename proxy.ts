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
  matcher: ['/((?!_next|cms|api|.*\\.[a-zA-Z0-9]+$).*)'],
}
