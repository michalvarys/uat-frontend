import Image from 'next/image'
import Link from 'next/link'
import { chakra, keyframes, usePrefersReducedMotion } from '@chakra-ui/react'

import RightArrowIcon from 'public/icons/common/arrow_right.svg'

const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
`

export function HeaderLinks({ news }) {
  const prefersReducedMotion = usePrefersReducedMotion()

  const animation = prefersReducedMotion
    ? undefined
    : `${blink} 2s ease-in-out infinite`

  return news.map(({ slug, id, title, blinking }) => (
    <Link key={id} href={`/news/${slug}`} passHref>
      <chakra.a
        animation={blinking ? animation : undefined}
        display="flex"
        flexDir="row"
        textDecoration="unset"
        gap={2}
        _hover={{
          textDecoration: 'underline',
          textDecorationStyle: 'solid',
        }}
        justifyContent={{ base: 'space-between', md: 'flex-start' }}
        p={{ base: '12px 8px', md: '0 8px 0 0' }}
        maxW={{ base: 'full', md: '45%' }}
        borderColor="black"
        borderBottom={{ base: '2px solid', md: 'none' }}
        sx={{
          '&:first-of-type': {
            pt: 0,
          },
          '&:last-of-type': {
            border: 'none',
          },
        }}
      >
        <chakra.span
          fontSize={{ base: 'lg', md: 'md' }}
          fontWeight={{ base: 'semibold', md: 'medium' }}
          overflow="hidden"
          textOverflow="ellipsis"
          textTransform="uppercase"
          whiteSpace="nowrap"
          maxW="90%"
        >
          {title}
        </chakra.span>
        <Image src={RightArrowIcon} alt="" />
      </chakra.a>
    </Link>
  ))
}
