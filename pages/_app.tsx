import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';

import { AppProvider } from '../components/context/AppContext';

import Layout from '../components/common/Layout';
import axios from 'axios';

const App = ({ Component, pageProps }: AppProps) => {
  const { locales, locale, defaultLocale } = useRouter();
  return (
    <AppProvider langs={locales || []} lang={locale || defaultLocale || '' }>
      <>
        <div id="modal-root"></div>
        {pageProps.menuData && (
          <Layout menu={pageProps.menuData.menu} footer={pageProps.menuData.footer}>
            <Component {...pageProps} />
          </Layout>
        )}
      </>
    </AppProvider>
  );
};

type PropsType = {
  router: any,
};

App.getInitialProps = async ({ router }: PropsType) => {
  const baseURL = process.env.NEXT_PUBLIC_IMAGE_URL;
  const port = process.env.NEXT_PUBLIC_API_PORT;
  const url = `${baseURL}:${port}/global?_locale=${router.locale}`;

  let res 
  try {
    res = await axios(url);
  } catch (e) {
    return {
      pageProps: {
        menuData: {}
      },
    };
  }
  const data = res.data;

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    pageProps: {
      menuData: data,
    },
  };
};
export default App;
