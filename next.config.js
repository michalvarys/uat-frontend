const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:1337'
const FRONTEND_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'http://0.0.0.0:3000/cms'
const FRONTEND_DOMAIN = process.env.NEXT_FRONTEND_DOMAIN
const BACKEND_DOMAIN = process.env.NEXT_BACKEND_DOMAIN
const feDomain = new URL(FRONTEND_BASE_URL).hostname
const beDomain = new URL(API_BASE_URL).hostname

// images.domains bylo v Next 14 označeno za zastaralé ve prospěch
// remotePatterns, které umožňují omezit i protokol a cestu.
const imageHosts = [
  feDomain,
  beDomain,
  FRONTEND_DOMAIN,
  BACKEND_DOMAIN,
  'devbackend.uat.sk',
  'cms.uat.sk',
  'localhost',
].filter(Boolean)

const remotePatterns = Array.from(new Set(imageHosts)).flatMap((hostname) =>
  ['https', 'http'].map((protocol) => ({
    protocol,
    hostname,
    pathname: '/**',
  }))
)

module.exports = {
  reactStrictMode: true,

  images: {
    remotePatterns,
  },

  // @ssupat/components se publikuje jako TypeScript zdroj bez zkompilovaného
  // JS. Dřív se překládal ručně nastaveným babel-loaderem ve webpack(),
  // což s Turbopackem (default od Next 16) nefunguje. transpilePackages je
  // nativní náhrada.
  transpilePackages: ['@ssupat/components'],

  // i18n klíč zde podporuje pouze Pages Router. Při přechodu na App Router
  // ho nahradí segment app/[lang]/ a proxy.ts — viz
  // docs/MIGRACE-NEXT-APP-ROUTER.md, Etapa 5.
  i18n: {
    locales: ['sk', 'en'],
    defaultLocale: 'sk',
    localeDetection: false,
  },

  rewrites() {
    return [
      {
        source: '/cms/:path*',
        destination: `${API_BASE_URL}/:path*`,
      },
    ]
  },
}
