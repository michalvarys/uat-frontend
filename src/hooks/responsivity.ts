import { useMediaQuery } from '@chakra-ui/react'

export function useLandscape() {
  const [isLandscape] = useMediaQuery('(orientation: landscape)')
  return isLandscape
}
