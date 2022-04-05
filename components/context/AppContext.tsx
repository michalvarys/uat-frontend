import moment from 'moment';
import { useRouter } from 'next/router';
import React, {
  createContext,
  useContext,
  useState
} from 'react';


type AppProviderType = {
  children?: JSX.Element,
  langs: Array<string>,
  lang: string,
};

type AppContextType = {
  languages: Array<string>,
  setCurrentLanguage: Function,
  setLocalePaths: Function,
  currentLanguage: string,
};


const AppContext = createContext<AppContextType>({
  languages: [],
  setCurrentLanguage: () => {},
  setLocalePaths: () => {},
  currentLanguage: '',
});

AppContext.displayName = 'AppContext';


const AppProvider= ({
  children,
  langs,
  lang,
}: AppProviderType) => {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState<string>(lang);
  const [localePaths, setLocalePaths] = useState<{ [name: string]: string } | null>(null);
  const languages = langs;

  const updateLanguage = (newLanguage: string) => {
    setCurrentLanguage(newLanguage);
    moment.locale(newLanguage)
    if (localePaths && localePaths[newLanguage]) {
      router.push(localePaths[newLanguage], localePaths[newLanguage], { locale: newLanguage });
    } else {
      router.push(router.asPath, router.asPath, { locale: newLanguage });
    }
  }

  const values = {
    languages,
    currentLanguage,
    setCurrentLanguage: updateLanguage,
    setLocalePaths,
  };

  return (
    <AppContext.Provider value={values}>
      {children}
    </AppContext.Provider>
  );
};


const useApp = () => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error(
      'useContactDetailsModal must be used within a ContactDetailsModalProvider',
    );
  }
  return context;
};

export { AppProvider, useApp };
