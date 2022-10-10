import { chakra, Flex } from '@chakra-ui/react'
import { ContainerVariant } from './ContainerVariant'

type Props = {
  children: JSX.Element | JSX.Element[] | null
  variant?: ContainerVariant
  isHigh?: boolean
  isHighest?: boolean
}

const Container = ({
  children,
  variant = ContainerVariant.Transparent,
  isHigh = false,
  isHighest = false,
}: Props) => (
  <Flex
    justifyContent="center"
    alignItems="center"
    w="full"
    color={variant === ContainerVariant.Black ? 'white' : 'black'}
    background={
      variant === ContainerVariant.White
        ? 'white'
        : variant === ContainerVariant.Orange
        ? 'brand.500'
        : variant === ContainerVariant.Transparent
        ? 'transparent'
        : 'black'
    }
  >
    <chakra.div
      maxWidth="1920px"
      w="full"
      zIndex={isHighest ? 1001 : isHigh ? 1000 : 1}
    >
      {children}
    </chakra.div>
  </Flex>
)

export default Container
