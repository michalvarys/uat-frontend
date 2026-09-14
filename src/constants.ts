// publicRuntimeConfig / serverRuntimeConfig byly v Next 16 odstraněny,
// v App Routeru nikdy nefungovaly. Náhradou je čtení process.env.
//
// NEXT_PUBLIC_* se zapéká do klientského bundlu už při buildu.
// API_TOKEN zůstává bez prefixu, takže se ke klientovi nedostane —
// smí ho číst jen serverový kód (getStaticProps, Server Components).
export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  'http://0.0.0.0:1337'

export const API_TOKEN = process.env.API_TOKEN

// Veřejná adresa webu. Slouží jako metadataBase pro absolutní URL
// v OG tazích, canonical odkazech a sitemap.xml.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NEXT_FRONTEND_DOMAIN
    ? `https://${process.env.NEXT_FRONTEND_DOMAIN}`
    : 'https://uat.sk')
).replace(/\/$/, '')

export const EDUPAGE_URL = 'https://ssuat.edupage.org/login/'
export const EDUPAGE_TITLE = 'EDUPAGE'
export const SCHOOL_SHORT_TITLE = 'SŠUPAT'

export const REVALIDATE_TIME = 10
