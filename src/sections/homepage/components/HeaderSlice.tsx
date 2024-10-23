import Image from 'next/image'
import { chakra, Flex, VStack } from '@chakra-ui/react'

import NewsType from 'src/components/news/types/NewsType'
import ImageType from 'src/components/common/types/ImageType'
import ImportantNewsRibbon from 'src/sections/homepage/components/ImportantNewsRibbon'
import SocialLinkType from 'src/types/data/SocialLinkType'
import { transformLink } from 'src/utils/link'

import { HeaderImage } from './HeaderImage'
import { DbImage } from 'src/components/DbImage'

type Props = {
  title?: string
  subtitle?: string
  image: ImageType
  logo: ImageType
  news: NewsType[]
  facebook: SocialLinkType
  instagram: SocialLinkType
  youtube: SocialLinkType
}

const HeaderSlice = ({
  news,
  title,
  subtitle,
  image,
  logo,
  facebook,
  instagram,
  youtube,
}: Props) => {
  return (
    <chakra.div
      position="relative"
      height="max-content"
      minHeight={{ base: 'calc(100vh - 98px)', xl: 'max-content' }}
    >
      <chakra.div
        position="relative"
        overflow="hidden"
        maxHeight="1552px"
        sx={{ height: 'calc(100vh - 146px)' }}
      >
        <HeaderImage image={image} />

        <Flex
          pos="absolute"
          flexDir="column"
          bottom={{ base: 24, md: 10, xl: 40 }}
          left={{ base: 10, md: 20 }}
          maxW={{ base: '90%', md: '80%', lg: '50%' }}
          fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
          lineHeight="100%"
          textTransform="uppercase"
          fontWeight="black"
          zIndex={1}
          sx={{
            '@media (max-height: 504px)': {
              bottom: 10,
            },
            '@media (min-height: 505px) and (max-height: 720px)': {
              bottom: 20,
              maxW: '70%',
              fontSize: '5xl',
            },
            '@media (min-height: 721px) and (max-height: 1023px)': {
              bottom: 14,
            },
            '@media (min-height: 1024px)': {
              bottom: '10%',
            },
            '@media (min-height: 721px) and (max-height: 1023px) and (max-width: 48em)':
              {
                bottom: '160px',
                maxWidth: '90%',
                left: '5%',
              },
            '@media (min-height: 1024px) and (max-width: 48em)': {
              bottom: '200px',
            },
          }}
        >
          {logo && (
            <chakra.div
              maxWidth={{ base: 40, md: 56, xl: 60 }}
              mb={{ base: 5, md: 10 }}
              sx={{
                '@media (max-height: 720px)': {
                  maxWidth: 36,
                  mb: 2,
                },
                '@media (min-height: 721px) and (max-height: 1024px)': {
                  maxWidth: 44,
                  mb: 4,
                },
              }}
            >
              <DbImage
                data={logo}
                props={(image) => ({
                  width: image.width,
                  height: image.height,
                })}
              />
            </chakra.div>
          )}

          <VStack
            spacing={0}
            placeItems="start"
            sx={{
              lineHeight: '100%',
              '@media (max-height: 1023px) and (max-width: 48em)': {
                fontSize: '77%',
              },
              '@media (max-height: 1023px) and (min-width: 48em)': {
                fontSize: '100%',
              },
              '@media (min-height: 1024px)': {
                fontSize: '120%',
              },
            }}
          >
            <chakra.span color="white">{title}</chakra.span>
            <chakra.span color="brand.500">{subtitle}</chakra.span>
          </VStack>
        </Flex>
      </chakra.div>

      <chakra.div
        position="relative"
        bottom={{ base: 4, lg: 0 }}
        left={0}
        right={0}
        sx={{
          '@media (min-height: 721px) and (max-height: 1023px) and (max-width: 48em)':
            {
              bottom: '80px',
            },
          '@media (min-height: 505px) and (max-height: 720px) and (min-width: 62em)':
            {
              bottom: 6,
            },
          '@media (min-height: 1024px) and (max-width: 48em)': {
            bottom: 12,
          },
        }}
      >
        <ImportantNewsRibbon
          news={news}
          facebook={facebook}
          instagram={instagram}
          youtube={youtube}
        />
      </chakra.div>
    </chakra.div>
  )
}

export default HeaderSlice
