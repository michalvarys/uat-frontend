import { chakra, Flex } from '@chakra-ui/react'

import SocialLinks from 'src/components/navigation/SocialLinks'
import NewsType from 'src/components/news/types/NewsType'
import SocialLinkType from 'src/types/data/SocialLinkType'

import { HeaderLinks } from './HeaderLinks'

import wave from 'public/icons/common/Wave.svg'

type Props = {
  news: NewsType[]
  facebook: SocialLinkType
  instagram: SocialLinkType
  youtube: SocialLinkType
}

export function ImportantNewsRibbon({
  news,
  facebook,
  instagram,
  youtube,
}: Props) {
  return (
    <Flex
      pos="relative"
      w="full"
      flexDir="row"
      bgColor="brand.500"
      color="black"
      px={{ base: 5, md: 20 }}
      py={{ base: 1, md: 3 }}
    >
      <chakra.div
        pos="absolute"
        top={{ base: -7, md: -5 }}
        left={0}
        right={0}
        height={`${wave.height}px`}
        zIndex={0}
        sx={{ backgroundImage: `url(${wave.src})` }}
      />

      <Flex
        mt={{ base: 2, md: 0 }}
        mr={{ base: 0, md: 4 }}
        flexDir="row"
        flexWrap="wrap"
      >
        <SocialLinks
          facebook={facebook}
          instagram={instagram}
          youtube={youtube}
          isDark
        />
      </Flex>

      <Flex
        overflow="hidden"
        flexWrap="wrap"
        flexDir={{ base: 'column', md: 'row' }}
        w={{ base: 'full', md: 'auto' }}
        m={{ base: 2, md: 'inherit' }}
        pl={{ base: 2, md: 0 }}
        pr={{ base: 3, md: 0 }}
        zIndex={1}
      >
        <HeaderLinks news={news} />
      </Flex>
    </Flex>
  )
}

export default ImportantNewsRibbon
