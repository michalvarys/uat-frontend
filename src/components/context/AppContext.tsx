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

type LocalesDictionary = { [name: string]: string }

type AppContextType = {
  languages: readonly string[]
  setCurrentLanguage(locale: string): void
  setLocalePaths: React.Dispatch<React.SetStateAction<LocalesDictionary | null>>
  currentLanguage: string
}

const AppContext = createContext<AppContextType>({
  languages: [],
  setCurrentLanguage() {
    //empty
  },
  setLocalePaths() {
    //empty
  },
  currentLanguage: '',
})

AppContext.displayName = 'AppContext'

const AppProvider = ({ children, langs, lang }: AppProviderType) => {
  const router = useRouter()
  const [currentLanguage, setCurrentLanguage] = useState<string>(lang)
  const [localePaths, setLocalePaths] = useState<LocalesDictionary | null>(null)
  const languages = langs

  const updateLanguage = (newLanguage: string) => {
    setCurrentLanguage(newLanguage)
    moment.locale(newLanguage)

    // V App Routeru je jazyk součástí cesty, ne volbou předanou routeru.
    // localePaths drží cestu k překladu konkrétního záznamu (jiný slug),
    // jinak se zůstává na stejné stránce.
    const target = localePaths?.[newLanguage] ?? router.asPath
    router.push(localePath(target, newLanguage))
  }

  const values: AppContextType = {
    languages,
    currentLanguage,
    setCurrentLanguage: updateLanguage,
    setLocalePaths,
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
