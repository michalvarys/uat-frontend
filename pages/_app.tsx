import '../styles/globals.css';
import { AppProps, AppContext, AppInitialProps } from 'next/app';
import { useRouter } from 'next/router';
import getConfig from 'next/config'

import { AppProvider } from '../components/context/AppContext';

import Layout from '../components/common/Layout';
import axios from 'axios';

const { publicRuntimeConfig } = getConfig()

axios.defaults.baseURL = publicRuntimeConfig.baseURL

function App({ Component, pageProps }: AppProps) {
  const { locales, locale, defaultLocale } = useRouter();
  return (
    <AppProvider langs={locales || []} lang={locale || defaultLocale || ''}>
      <>
        <div id="modal-root"></div>

        {pageProps.menuData && (
          <Layout menu={pageProps.menuData.menu} footer={pageProps.menuData.footer}>
            {/** @ts-ignore */}
            <Component {...pageProps} />
          </Layout>
        )}
      </>
    </AppProvider>
  );
};

App.getInitialProps = async ({ router }: AppContext): Promise<AppInitialProps> => {
  const url = `/global?_locale=${router.locale}`;

  try {
    const { data } = await axios(url);

    return {
      pageProps: {
        menuData: data,
      },
    };
  } catch (e) {
    return {
      pageProps: {
        menuData: {}
      },
    };
  }
};

export default App;
