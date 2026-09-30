import type { Config } from 'next-i18n-router/dist/types'

import { LOCALES, DEFAULT_LOCALE } from 'src/i18n/config'

/**
 * Nastavení směrování podle jazyka pro next-i18n-router.
 *
 * Nahrazuje ruční přepis v proxy.ts, který uměl jen namapovat veřejnou
 * adresu na interní segment [lang]. Knihovna k tomu přidává cookie
 * s volbou jazyka a jednotné chování pro všechny jazyky.
 */
const i18nConfig: Config = {
  locales: [...LOCALES],
  defaultLocale: DEFAULT_LOCALE,

  // Slovenština zůstává bez prefixu (/news), ostatní jazyky ho mají
  // (/en/news). Adresy webu se tím nemění a existující odkazy
  // ani pozice ve vyhledávačích nejsou v ohrožení.
  prefixDefault: false,

  // Jazyk se z prohlížeče schválně nehádá. Anglických překladů je
  // v CMS zatím málo, takže návštěvník s anglickým prohlížečem by
  // dostal poloprázdný web místo slovenského obsahu. Jazyk si volí
  // sám přepínačem a volba se uloží do cookie NEXT_LOCALE.
  //
  // Až bude překladů dost, stačí tenhle řádek smazat a detekce podle
  // hlavičky Accept-Language se zapne sama.
  localeDetector: false,

  // Cookie se nepoužívá. Pro adresu bez prefixu má přednost před
  // výchozím jazykem, takže po jednom přepnutí do angličtiny se i /news
  // přesměrovalo na /en/news — slovenština pak nešla vrátit ani ručním
  // přepsáním adresy, ani přepínačem (ten míří právě na /news).
  //
  // Jazyk drží adresa, což je pro vyhledávače i sdílení odkazů
  // jednoznačnější než stav schovaný v prohlížeči.
  // Prázdný název cookie ji vypne — `undefined` by se přepsalo
  // výchozím 'NEXT_LOCALE'.
  localeCookie: '',
}

export default i18nConfig
