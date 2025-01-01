import { AppProps, AppContext, AppInitialProps } from 'next/app'
import { useRouter } from 'next/router'
import axios from 'axios'

import Layout from 'src/components/common/Layout'
import { AppProvider } from 'src/components/context/AppContext'
import { BASE_URL, API_TOKEN } from 'src/constants'

import '@fontsource/inter'
import dynamic from 'next/dist/shared/lib/dynamic'
import { MenuSection } from 'src/components/common/Header/Header'
import FooterType from 'src/types/data/FooterType'
import { getInitialPropsData } from 'src/queries/initial'
import { Fonts } from '@ssupat/components/src/theme/fonts'

const ThemeProvider = dynamic(
  () => import('@ssupat/components/src/theme').then((mod) => mod.default),
  {
    ssr: false,
  }
)

axios.defaults.baseURL = BASE_URL
axios.defaults.headers['Authorization'] = `Bearer ${API_TOKEN}`
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
export type InitialProps = {
  menuData: {
    footer: FooterType
    menu: MenuSection[]
  }
}

export type PageProps<T extends object> = InitialProps & T

App.getInitialProps = async ({
  router,
}: AppContext): Promise<AppInitialProps> => {
  try {
    const data = await getInitialPropsData(router.locale)

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
