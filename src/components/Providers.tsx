'use client'

import axios from 'axios'

import ThemeProvider from 'src/theme'
import { Fonts } from '@ssupat/components/src/theme/fonts'
import { AppProvider } from 'src/components/context/AppContext'
import { BASE_URL } from 'src/constants'

axios.defaults.baseURL = BASE_URL

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
 * Autorizační hlavička se tu záměrně nenastavuje: API_TOKEN je serverový
 * secret a v klientském bundlu by byl veřejně čitelný.
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
