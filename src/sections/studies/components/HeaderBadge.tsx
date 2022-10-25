import Image from 'next/image'
import { Flex } from '@chakra-ui/react'
import { transformLink } from 'src/utils/link'

type Props = {
  icon?: {
    url: string
    alternativeText?: string
  }
  code?: string
}

export function HeaderBadge({ icon, code }: Props) {
  return (
    <Flex w={{ base: 'full', sm: 'max-content' }} bgColor="brand.500">
      <Flex
        flexDir="row"
        placeItems="center"
        minHeight="60px"
        minWidth="60px"
        sx={{ '> div': { marginInline: 'auto' } }}
      >
        {icon && (
          <Image
            alt={icon.alternativeText}
            src={transformLink(icon.url)}
            width={44}
            height={44}
            layout={'fixed'}
            objectFit={'contain'}
            objectPosition={'center center'}
          />
        )}
      </Flex>
      <Flex
        fontFamily="writer"
        fontWeight="black"
        fontSize="sm"
        bgColor="black"
        color="brand.500"
        placeItems="center"
        flex={1}
        m={1}
        ml={0}
        px={4}
      >
        <span>{code}</span>
      </Flex>
    </Flex>
  )
}
