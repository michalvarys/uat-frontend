export const LOCALES = ['sk', 'en'] as const
export type Locale = (typeof LOCALES)[number]

/**
 * Slovenština je výchozí a běží bez prefixu v URL (/news),
 * ostatní jazyky s prefixem (/en/news). Díky tomu se po přechodu
 * na App Router nemění existující adresy a není potřeba redirect.
 */
export const DEFAULT_LOCALE: Locale = 'sk'

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

/** Cesta ke stránce v daném jazyce, respektuje bezprefixovou slovenštinu. */
export function localePath(path: string, locale: string): string {
  const clean = `/${path}`.replace(/\/+/g, '/').replace(/\/$/, '') || '/'
  return locale === DEFAULT_LOCALE ? clean : `/${locale}${clean}`
}
