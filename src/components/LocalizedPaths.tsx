'use client'

import { useEffect } from 'react'

import { useApp } from 'src/components/context/AppContext'
import { localePath } from 'src/i18n/config'

type Localization = {
  id?: number | string
  locale?: string
  slug?: string
}

type Props = {
  /** Překlady záznamu ze Strapi (pole localizations). */
  localizations?: Localization[] | { data?: Localization[] } | null
  /**
   * Předpona cesty k detailu, například '/studies' nebo '/news'.
   *
   * Předává se řetězec, ne funkce: ze serverové komponenty do klientské
   * funkce předat nejde ("Functions cannot be passed directly to Client
   * Components").
   */
  basePath: string
}

/**
 * Nastaví, kam vede přepnutí jazyka na detailu záznamu.
 *
 * Bez toho přepínač jen prohodí jazykový prefix a nechá v adrese
 * původní id nebo slug. Jenže každý jazyk má vlastní záznam — obor 6 je
 * slovensky, anglicky je to obor 17 — takže by se zobrazila původní
 * jazyková verze pod adresou druhého jazyka.
 *
 * Komponenta nic nevykresluje, jen předá cesty do kontextu.
 */
export function LocalizedPaths({ localizations, basePath }: Props) {
  const { setLocalizedPaths } = useApp()

  useEffect(() => {
    const items = Array.isArray(localizations)
      ? localizations
      : localizations?.data ?? []

    const paths = items.reduce<Record<string, string>>((acc, item) => {
      // Strapi vrací atributy buď přímo, nebo zabalené v `attributes`.
      // Id ale zůstává na vnější úrovni, ne uvnitř `attributes` —
      // u záznamů bez slugu (obory) se adresuje právě jím.
      const data = (item as { attributes?: Localization }).attributes ?? item
      const id = item.id ?? data.id
      const key = data.slug ?? (id != null ? String(id) : null)

      if (data.locale && key) {
        acc[data.locale] = localePath(`${basePath}/${key}`, data.locale)
      }

      return acc
    }, {})

    setLocalizedPaths(Object.keys(paths).length ? paths : null)

    // Po odchodu ze stránky se cesty musí zahodit, jinak by přepínač
    // na další stránce mířil na starý záznam.
    return () => setLocalizedPaths(null)
  }, [localizations, basePath, setLocalizedPaths])

  return null
}

export default LocalizedPaths
