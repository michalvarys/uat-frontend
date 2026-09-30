'use client'

import { useMediaQuery } from '@chakra-ui/react'

export function useLandscape() {
  // Na serveru window neexistuje. Bez explicitního fallbacku vrací
  // useMediaQuery v Chakře 2 nedefinovanou hodnotu a render spadne,
  // takže se během SSR chováme jako na výšku a po hydrataci se to srovná.
  const [isLandscape] = useMediaQuery('(orientation: landscape)', {
    ssr: true,
    fallback: false,
  })
  return isLandscape
}
