'use client'

import ThemeProvider from 'src/theme'
import { Fonts } from '@ssupat/components/src/theme/fonts'
import { AppProvider } from 'src/components/context/AppContext'

type Props = {
  children: React.ReactNode
  lang: string
  langs: readonly string[]
}

/**
 * Klientská hranice aplikace. Chakra i AppContext potřebují běžet
 * v prohlížeči, ale obsah pod nimi zůstává serverový — proto je tahle
 * obálka co nejtenčí a nesahá na data stránek.
 *
 * Konfigurace axiosu se tu záměrně nenastavuje: adresa CMS se čte
 * z proměnných prostředí, které klientský bundl nevidí. Serverové dotazy
 * mají vlastního klienta (src/queries/client.ts) a ojedinělá volání
 * z prohlížeče chodí na relativní /cms, které nginx přesměruje na Strapi.
 */
export function Providers({ children, lang, langs }: Props) {
  return (
    <ThemeProvider>
      <Fonts />
      <AppProvider langs={langs} lang={lang}>
        <>{children}</>
      </AppProvider>
    </ThemeProvider>
  )
}

export default Providers
