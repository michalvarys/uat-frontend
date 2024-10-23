import Image from 'next/image'
import { transformLink } from 'src/utils/link'
import { ContainerVariant } from 'src/components/common/Container'
import { FieldOfStudyType } from 'src/types/fieldsOfStudy'
import { chakra, Flex } from '@chakra-ui/react'
import { HeaderBadge } from './HeaderBadge'
import { HeaderButton } from './HeaderButtons'
import { DbImage } from 'src/components/DbImage'
import { getAttributes } from 'src/utils/data'

type Props = {
  data: FieldOfStudyType
}

export const FieldOfStudyHeader = ({ data }: Props) => {
  const icon = getAttributes(data.icon_svg)
  return (
    <Flex
      position="relative"
      flexDir={{ base: 'column-reverse', lg: 'row' }}
      h={{ base: 'auto', lg: 'inherit' }}
      alignItems={{ base: 'flex-start', lg: 'stretch' }}
      minHeight="calc(100vh - 98px)"
      mb={{ base: 0, lg: 40 }}
      overflow="hidden"
      sx={{
        // Don't sretch the header across large pages
        '@media (min-height: 1280px)': {
          minHeight: '1240px',
        },
      }}
    >
      <Flex
        placeItems="center"
        zIndex={2}
        flex={{ base: '0 1 62%', lg: '0 1 48%', '2xl': '0 1 40%' }}
        width={{ xs: '100%', lg: '660px' }}
        padding={['60px 20px', '80px 40px', '60px 40px', '0 0 80px 80px']}
      >
        <Flex flexDir="column" justifyContent="flex-end" h="full">
          <chakra.h1
            fontSize={['4xl', '5xl', '6xl', '7xl']}
            lineHeight="100%"
            textTransform="uppercase"
            wordBreak="break-word"
            minWidth="200px"
            my={0}
          >
            {data.name}
          </chakra.h1>

          <Flex
            flexDir={{ base: 'column', sm: 'row' }}
            alignItems="stretch"
            pt={4}
          >
            <HeaderBadge code={data?.code} icon={icon} />
            <chakra.span
              display="flex"
              flex="1 1"
              alignSelf="center"
              color="brand.500"
              fontFamily="writer"
              fontWeight="black"
              textTransform="uppercase"
              whiteSpace="pre-wrap"
              py={{ base: 4, sm: 0 }}
              pl={{ base: 0, sm: 4 }}
            >
              {data?.short_description || ''}
            </chakra.span>
          </Flex>

          <chakra.span
            display="flex"
            flex="0 1 50%"
            pt={{ base: 6, sm: 4 }}
            whiteSpace="pre-wrap"
            fontSize="md"
          >
            {data.description}
          </chakra.span>

          <Flex flexWrap="wrap" w="full" gap="20px" pt={8}>
            {data.buttons?.filter(Boolean).map((button) => (
              <div key={`link-=${button.id}`}>
                <HeaderButton {...button} />
              </div>
            ))}
          </Flex>
        </Flex>
      </Flex>

      <Flex
        position={{ base: 'relative', lg: 'absolute' }}
        overflow={{ base: 'hidden', lg: 'inherit' }}
        w={{ base: 'full', lg: '60%' }}
        top={0}
        right={0}
        h="full"
        maxH={{ base: '42vh', md: '75vh', lg: '100%' }}
        sx={{ '> div': { width: '100%', height: '100%' } }}
      >
        <DbImage
          data={data.image}
          props={(image) => ({
            width: image.width,
            height: image.height,
            objectFit: 'cover',
            objectPosition: 'left top',
            layout: 'responsive',
          })}
        />
      </Flex>
    </Flex>
  )
}

FieldOfStudyHeader.defaultProps = {
  extraBottomSpace: 0,
  extraTopSpace: 0,
  extraTextTopSpace: 0,
  variant: ContainerVariant.White,
}
