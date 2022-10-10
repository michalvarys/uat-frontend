import { AppProps, AppContext, AppInitialProps } from 'next/app'
import { useRouter } from 'next/router'
import axios from 'axios'

import Layout from 'src/components/common/Layout'
import { AppProvider } from 'src/components/context/AppContext'
import { ThemeProvider } from 'src/theme/ThemeProvider'
import { BASE_URL } from 'src/constants'

import 'src/styles/globals.css'
import { chakra } from '@chakra-ui/react'

axios.defaults.baseURL = BASE_URL

function App({ Component, pageProps }: AppProps) {
  const { locales, locale, defaultLocale } = useRouter()
  return (
    <ThemeProvider>
      <AppProvider langs={locales || []} lang={locale || defaultLocale || ''}>
        <>
          <div id="modal-root" />

          {pageProps.menuData && (
            <Layout
              menu={pageProps.menuData.menu}
              footer={pageProps.menuData.footer}
            >
              {/**
               * eslint-disable-next-line @typescript-eslint/ban-ts-comment
               * @ts-ignore */}
              <Component {...pageProps} />
            </Layout>
          )}
        </>
      </AppProvider>
    </ThemeProvider>
  )
}

App.getInitialProps = async ({
  router,
}: AppContext): Promise<AppInitialProps> => {
  const url = `/global?_locale=${router.locale}`

  try {
    const { data } = await axios(url)

    return {
      pageProps: {
        menuData: data,
      },
    }
  } catch (e) {
    return {
      pageProps: {
        menuData: {},
      },
    }
  }
}

export default App
