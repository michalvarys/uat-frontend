// Konfigurace se čte z proměnných prostředí až za běhu.
//
// Proměnné s prefixem NEXT_PUBLIC_ se zapékají do klientského bundlu už
// při buildu, takže by adresa CMS i vlastní doména byly v image natvrdo
// a jeden image by neobsloužil staging i produkci. Data se ale stahují
// v Server Components, kde prefix potřeba není — proto se sem předávají
// běžné proměnné a obě prostředí sdílejí tentýž image.
//
// Starší NEXT_PUBLIC_* zůstávají jako záloha, aby fungoval i image
// postavený před touto změnou.

/**
 * Adresa Strapi pro serverová volání.
 *
 * V Dockeru se míří na vnitřní jméno služby (http://strapi:1337): je
 * stejné pro každé prostředí, nezávisí na doméně ani certifikátu
 * a provoz neopouští stroj.
 */
export const BASE_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  'http://0.0.0.0:1337'

/**
 * Předpona odkazů na soubory ze Strapi (obrázky, dokumenty).
 *
 * Záměrně relativní: prohlížeč si doménu doplní sám, takže hodnota
 * nezávisí na prostředí ani na tom, co se zapeklo do buildu. Cestu /cms
 * přepošle middleware na Strapi ve vnitřní síti Dockeru.
 */
export const PUBLIC_API_URL = (() => {
  const configured = process.env.PUBLIC_API_URL?.trim()

  // Absolutní adresu záměrně ignorujeme. Seznam povolených domén pro
  // optimalizátor obrázků (images.remotePatterns) se zapéká do buildu
  // v CI, kde doména prostředí není známá — /_next/image by na ni
  // odpověděl 400 "url parameter is not allowed" a nenačetl by se
  // jediný obrázek z CMS. Relativní /cms je lokální cesta, kterou
  // middleware přepošle na Strapi, takže povolení nepotřebuje.
  if (!configured || /^https?:\/\//i.test(configured)) {
    return '/cms'
  }

  return configured
})()

/**
 * Token pro Strapi. Bez prefixu NEXT_PUBLIC_ schválně — do klientského
 * bundlu se nesmí dostat.
 */
export const API_TOKEN = process.env.API_TOKEN

/**
 * Veřejná adresa webu. Slouží jako metadataBase pro absolutní URL
 * v OG tazích, canonical odkazech a sitemap.xml.
 */
export const SITE_URL = (
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.FRONTEND_DOMAIN || process.env.NEXT_FRONTEND_DOMAIN
    ? `https://${process.env.FRONTEND_DOMAIN || process.env.NEXT_FRONTEND_DOMAIN}`
    : 'https://uat.sk')
).replace(/\/$/, '')

export const EDUPAGE_URL = 'https://ssuat.edupage.org/login/'
export const EDUPAGE_TITLE = 'EDUPAGE'
export const SCHOOL_SHORT_TITLE = 'SŠUPAT'

export const REVALIDATE_TIME = 10
