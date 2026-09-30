import { NextResponse, type NextRequest } from 'next/server'
import { i18nRouter } from 'next-i18n-router'

import i18nConfig from './i18nConfig'

/**
 * Proxy na Strapi a směrování podle jazyka.
 *
 * Jazyk řeší next-i18n-router: slovenština běží bez prefixu (/news),
 * ostatní jazyky s ním (/en/news). Volba jazyka se ukládá do cookie
 * NEXT_LOCALE, takže přepínač funguje napříč stránkami.
 *
 * Interní tvar /sk/... se z middlewaru vynechává (viz matcher níž),
 * takže se z něj na veřejnou adresu nepřesměrovává. Odkazy na webu
 * na něj nevedou; kdyby to vadilo kvůli duplicitnímu obsahu,
 * patří to do nginxu před aplikaci.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Proxy na Strapi. Dřív to řešily `rewrites` v next.config.js, jenže
  // standalone build je zapéká do server.js už při buildu — adresa CMS
  // v nich zůstala na výchozí 0.0.0.0:1337 a požadavky končily
  // na ECONNREFUSED. Middleware se vyhodnocuje za běhu, takže proměnnou
  // přečte správně.
  //
  // Musí zůstat před směrováním jazyka: /cms/... nejsou stránky webu
  // a prefix jazyka by na nich neměl co dělat.
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

  return i18nRouter(request, i18nConfig)
}

export const config = {
  // Nepřepisují se interní cesty Nextu, API, proxy na CMS ani soubory
  // z public/. Ty se poznají podle přípony — vyjmenovávat složky ručně
  // je křehké: chyběly tam fonts/ i icons/ a prohlížeč pak na ně
  // dostával 404.
  // Dvě pravidla, protože se vylučuje z různých důvodů:
  //
  // 1. /cms/** vždy projde middlewarem — proxy na Strapi se dělá tam.
  //    Přípona tu nesmí rozhodovat: /cms/uploads/x.svg je soubor, ale
  //    leží na Strapi, ne v public/.
  // 2. všechno ostatní kromě interních cest Nextu, API a souborů
  //    s příponou; bez toho by se /fonts/x.woff2 přepsalo
  //    na /sk/fonts/x.woff2 a vracelo 404.
  // 3. /sk/** se vynechává schválně. Přepis /news → /sk/news projde
  //    middlewarem podruhé a knihovna by ho poslala zpět na /news,
  //    tedy dokola; oba průchody jsou přitom nerozlišitelné. Veřejné
  //    adresy prefix výchozího jazyka nemají, takže se tím nic
  //    nepřístupného nestává — jen /sk/news zůstane v adrese místo
  //    přesměrování na /news.
  matcher: [
    '/cms/:path*',
    '/((?!_next|api|cms|sk(?:/|$)|.*\\.[a-zA-Z0-9]+$).*)',
  ],
}
