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
  /**
   * Kam vede přepnutí jazyka na aktuální stránce.
   *
   * Detaily záznamů mají v každém jazyce vlastní adresu — obor 6 je
   * slovensky, anglicky je to obor 17 — takže nestačí prohodit prefix.
   * Stránka sem proto může předat cestu pro každý jazyk; když ji
   * nepředá, prohodí se prefix jako dřív.
   */
  setLocalizedPaths(paths: Record<string, string> | null): void
}

const AppContext = createContext<AppContextType>({
  languages: [],
  setCurrentLanguage() {
    //empty
  },
  currentLanguage: '',
  setLocalizedPaths() {
    //empty
  },
})

AppContext.displayName = 'AppContext'

const AppProvider = ({ children, langs, lang }: AppProviderType) => {
  const router = useRouter()
  const [currentLanguage, setCurrentLanguage] = useState<string>(lang)
  const [localizedPaths, setLocalizedPaths] = useState<Record<
    string,
    string
  > | null>(null)
  const languages = langs

  const updateLanguage = (newLanguage: string) => {
    setCurrentLanguage(newLanguage)
    moment.locale(newLanguage)

    // Detail záznamu má v každém jazyce vlastní adresu, protože jde
    // o samostatné záznamy s vlastními id. Když stránka cíl zná,
    // použije se; jinak stačí prohodit jazykový prefix — u přehledů
    // a statických stránek je adresa v obou jazycích stejná.
    const target = localizedPaths?.[newLanguage]

    router.push(target ?? localePath(router.asPath, newLanguage))
  }

  const values: AppContextType = {
    languages,
    currentLanguage,
    setCurrentLanguage: updateLanguage,
    setLocalizedPaths,
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
