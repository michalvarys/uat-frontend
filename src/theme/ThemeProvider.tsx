import {
  ChakraProvider,
  extendTheme,
  createMultiStyleConfigHelpers,
} from '@chakra-ui/react'
import { PropsWithChildren } from 'react'
import { colors, brand } from './colors'
import { fonts } from './fonts'
import { tabsAnatomy } from '@chakra-ui/anatomy'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys)

const tabsThemeBaseStyle = definePartsStyle({
  tab: {
    fontWeight: 'semibold',
  },
  tablist: {
    button: {
      _selected: {
        color: 'white',
        backgroundColor: 'orange.500',
      },
    },
  },
})

const tabsTheme = defineMultiStyleConfig({
  baseStyle: tabsThemeBaseStyle,
})

export const theme = extendTheme({
  components: {
    Tabs: tabsTheme,
  },
  colors: {
    ...colors,
    brand,
  },
  fonts,
  styles: {
    global: {
      '#__next': {
        overflow: 'hidden',
      },
      'html, body': {
        padding: 0,
        margin: 0,
        fontFamily: 'Inter, sans-serif',
        backgroundColor: 'black',
      },
      '*': {
        boxSizing: 'border-box',
      },
      body: {
        scrollbarWdth: 'auto',
        scrollbarColor: `${brand['400']} ${colors.black}00`,
      },
      h1: {
        fontSize: '70px',
        fontWeight: 900,
      },
      h2: {
        fontSize: '60px',
        fontWeight: 800,
        margin: 0,
      },
      h3: {
        fontSize: '1.17em',
        fontWeight: 'bold',
      },
    },
  },
})

export function ThemeProvider({ children }: PropsWithChildren<unknown>) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>
}

export default ThemeProvider
