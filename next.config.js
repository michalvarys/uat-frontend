// Konfigurace se čte z proměnných prostředí. next.config.js se vyhodnocuje
// i při startu serveru, ne jen při buildu, takže adresy nemusí být
// v image zapečené a jeden image obslouží staging i produkci.
//
// NEXT_PUBLIC_* varianty zůstávají jako záloha kvůli starším image.
const API_BASE_URL =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:1337'
const FRONTEND_BASE_URL =
  process.env.BASE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  'http://0.0.0.0:3000/cms'
const FRONTEND_DOMAIN =
  process.env.FRONTEND_DOMAIN || process.env.NEXT_FRONTEND_DOMAIN
const BACKEND_DOMAIN =
  process.env.BACKEND_DOMAIN || process.env.NEXT_BACKEND_DOMAIN
const feDomain = new URL(FRONTEND_BASE_URL).hostname
const beDomain = new URL(API_BASE_URL).hostname

// images.domains bylo v Next 14 označeno za zastaralé ve prospěch
// remotePatterns, které umožňují omezit i protokol a cestu.
//
// Pozor na rozdíl: domains port ignorovaly, remotePatterns ho porovnávají.
// Bez něj vrací /_next/image na http://localhost:1337/... stav 400,
// proto se u známých adres přebírá port z URL.
const imageOrigins = [API_BASE_URL, FRONTEND_BASE_URL].filter(Boolean)

// Obrázky z CMS chodí přes relativní /cms, takže se berou jako lokální
// a remotePatterns se na ně nevztahují. Seznam zůstává jen pro obsah,
// který v databázi drží plnou adresu z dřívějška.
const extraHosts = [
  FRONTEND_DOMAIN,
  BACKEND_DOMAIN,
  'devbackend.uat.sk',
  'cms.uat.sk',
].filter(Boolean)

const remotePatterns = [
  ...imageOrigins.map((origin) => {
    const { protocol, hostname, port } = new URL(origin)
    return {
      protocol: protocol.replace(':', ''),
      hostname,
      ...(port ? { port } : {}),
      pathname: '/**',
    }
  }),
  ...extraHosts.flatMap((hostname) =>
    ['https', 'http'].map((protocol) => ({
      protocol,
      hostname,
      pathname: '/**',
    }))
  ),
]

module.exports = {
  reactStrictMode: true,

  // Standalone build zabalí jen skutečně použité závislosti, takže
  // produkční image nemusí nést celý node_modules.
  output: 'standalone',

  // SCSS moduly importují sdílené proměnné relativní cestou. Ta se láme,
  // jakmile se soubor přesune (pages/ -> app/), proto se importy píšou
  // od kořene projektu a Sass je hledá tady.
  sassOptions: {
    includePaths: [__dirname],
  },

  images: {
    remotePatterns,
    // Obrázky z CMS se na klientovi adresují relativně přes /cms, aby
    // nezávisely na proměnných prostředí (ty v prohlížeči nejsou).
    // next/image takovou cestu bere jako lokální a od Next 16 ji musí
    // povolit localPatterns.
    localPatterns: [{ pathname: '/cms/**' }, { pathname: '/**' }],
    // Next 16 blokuje optimalizaci obrázků z lokálních IP kvůli SSRF.
    // Při vývoji ale CMS běží na localhost:1337, takže by se nenačetl
    // jediný obrázek. V produkci je backend na veřejné doméně a ochrana
    // zůstává zapnutá.
    dangerouslyAllowLocalIP: process.env.NODE_ENV === 'development',
  },

  // @ssupat/components se publikuje jako TypeScript zdroj bez zkompilovaného
  // JS. Dřív se překládal ručně nastaveným babel-loaderem ve webpack(),
  // což s Turbopackem (default od Next 16) nefunguje. transpilePackages je
  // nativní náhrada.
  transpilePackages: ['@ssupat/components'],


  rewrites() {
    return [
      {
        source: '/cms/:path*',
        destination: `${API_BASE_URL}/:path*`,
      },
    ]
  },
}
