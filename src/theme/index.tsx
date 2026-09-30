import { PropsWithChildren } from 'react'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { themeProps } from '@ssupat/components/src/theme/ThemeProvider'

/**
 * ChakraProvider se záměrně instancuje z lokálního @chakra-ui/react,
 * nikoli z @ssupat/components.
 *
 * Knihovna se překládá přes transpilePackages, čímž vznikne druhá instance
 * Chakra modulu. Provider z knihovny by pak zapsal kontext, který hooky
 * v aplikaci (useBreakpointValue, useMediaQuery) nevidí — dostaly by prázdné
 * téma bez interního __breakpoints a render by při SSR spadl na
 * "Cannot read properties of undefined (reading 'details')".
 *
 * Právě kvůli tomu byl dřív celý strom vyřazen ze serverového renderingu
 * (dynamic import s ssr: false), takže web negeneroval žádné HTML.
 *
 * Definice tématu zůstává sdílená — importuje se themeProps, ne hotový theme.
 */
export const theme = extendTheme(themeProps)

export function ThemeProvider({ children }: PropsWithChildren<unknown>) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>
}

export default ThemeProvider
