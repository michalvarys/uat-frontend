'use client'

import { useRouter as useNextRouter, usePathname } from 'next/navigation'
import { useCallback, useMemo } from 'react'

import { DEFAULT_LOCALE, LOCALES, isLocale } from 'src/i18n/config'

/**
 * Náhrada za `useRouter` z `next/router`.
 *
 * App Router žádný `next/router` nemá a `next/navigation` nezná pojem locale —
 * jazyk je v App Routeru běžný segment cesty. Tenhle hook dopočítá `locale`,
 * `locales` a `asPath` z URL, takže komponenty přenesené z Pages Routeru
 * fungují beze změny svého API.
 *
 * Slovenština běží bez prefixu, takže se odvozuje jako výchozí jazyk.
 */
export function useAppRouter() {
  const router = useNextRouter()
  const pathname = usePathname() || '/'

  const [locale, asPath] = useMemo(() => {
    const [, maybeLocale, ...rest] = pathname.split('/')

    if (isLocale(maybeLocale) && maybeLocale !== DEFAULT_LOCALE) {
      return [maybeLocale, `/${rest.join('/')}`]
    }

    return [DEFAULT_LOCALE, pathname]
  }, [pathname])

  const push = useCallback(
    (href: string) => {
      router.push(href)
    },
    [router]
  )

  return {
    locale,
    locales: LOCALES,
    defaultLocale: DEFAULT_LOCALE,
    asPath: asPath || '/',
    pathname: asPath || '/',
    push,
    replace: router.replace,
    back: router.back,
    prefetch: router.prefetch,
  }
}

export default useAppRouter
