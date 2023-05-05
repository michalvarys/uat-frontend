import { AppProps, AppContext, AppInitialProps } from 'next/app'
import { useRouter } from 'next/router'
import axios from 'axios'

import Layout from 'src/components/common/Layout'
import { AppProvider } from 'src/components/context/AppContext'
import { BASE_URL } from 'src/constants'

import '@fontsource/inter'
import { Fonts } from 'src/theme/fonts'
import dynamic from 'next/dist/shared/lib/dynamic'

const ThemeProvider = dynamic(() => import('src/theme/ThemeProvider'), {
  ssr: false,
})

axios.defaults.baseURL = BASE_URL
function App({ Component, pageProps }: AppProps) {
  const { locales, locale, defaultLocale } = useRouter()

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <ThemeProvider>
      <Fonts />
      <AppProvider langs={locales || []} lang={locale || defaultLocale || ''}>
        <>
          <div id="modal-root" />

          {/*}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore */}
          <Layout
            menu={pageProps?.menuData?.menu}
            footer={pageProps?.menuData?.footer}
          >
            {/**
             * eslint-disable-next-line @typescript-eslint/ban-ts-comment
             * @ts-ignore */}
            <Component {...pageProps} />
          </Layout>
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
    const { data } = await axios.get(url)

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
