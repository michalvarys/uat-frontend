import { BASE_URL } from 'src/constants'

/**
 * Doplní k cestě ze Strapi adresu, na které je soubor dostupný.
 *
 * Volá se i z klientských komponent (obrázky přes DbImage), kde proměnné
 * prostředí nejsou k dispozici — v prohlížeči by tak vznikla adresa
 * z výchozí hodnoty `http://0.0.0.0:1337` a obrázek by se nenačetl.
 *
 * Na klientovi se proto vrací relativní `/cms/...`, které Next přepisuje
 * na Strapi (viz rewrites v next.config.js). Na serveru se použije plná
 * adresa, aby fetch při generování stránek věděl, kam se obrátit.
 */
export const transformLink = (url: string): string => {
  url = url?.trim() || ''

  if (url.startsWith('http')) {
    return url
  }

  if (typeof window !== 'undefined') {
    return `/cms${url}`
  }

  return `${BASE_URL}${url}`
}

export function isExternalLink(url: string) {
  url = url?.trim() || ''

  if (!url.startsWith('http')) {
    return false
  }

  try {
    const { hostname } = new URL(BASE_URL)
    return !url.includes(hostname)
  } catch {
    return true
  }
}
