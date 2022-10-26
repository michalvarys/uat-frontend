import Image from 'next/image'
import Link from 'next/link'
import { chakra } from '@chakra-ui/react'

import RightArrowIcon from 'public/icons/common/arrow_right.svg'

export function HeaderLinks({ news }) {
  return news.map(({ slug, id, title }) => (
    <Link key={id} href={`/news/${slug}`} passHref>
      <chakra.a
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
