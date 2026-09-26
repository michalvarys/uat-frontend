'use client'

import moment from 'moment'
import { useAppRouter as useRouter } from 'src/hooks/useAppRouter'
import { localePath } from 'src/i18n/config'
import React, { createContext, useContext, useState } from 'react'

type AppProviderType = {
  children?: JSX.Element
  // Next 15 vrací router.locales jako readonly.
  langs: readonly string[]
  lang: string
}

type AppContextType = {
  languages: readonly string[]
  setCurrentLanguage(locale: string): void
  currentLanguage: string
}

const AppContext = createContext<AppContextType>({
  languages: [],
  setCurrentLanguage() {
    //empty
  },
  currentLanguage: '',
})

AppContext.displayName = 'AppContext'

const AppProvider = ({ children, langs, lang }: AppProviderType) => {
  const router = useRouter()
  const [currentLanguage, setCurrentLanguage] = useState<string>(lang)
  const languages = langs

  const updateLanguage = (newLanguage: string) => {
    setCurrentLanguage(newLanguage)
    moment.locale(newLanguage)

    // V App Routeru je jazyk součástí cesty. Záznamy mají v obou
    // jazycích stejný slug, takže stačí prohodit jazykový prefix.
    router.push(localePath(router.asPath, newLanguage))
  }

  const values: AppContextType = {
    languages,
    currentLanguage,
    setCurrentLanguage: updateLanguage,
  }

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>
}

const useApp = () => {
  const context = useContext(AppContext)

  if (context === undefined) {
    throw new Error(
      'useContactDetailsModal must be used within a ContactDetailsModalProvider'
    )
  }
  return context
}

export { AppProvider, useApp }
