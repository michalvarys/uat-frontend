import Image from 'next/image'
import { Box, Flex, Text } from '@chakra-ui/react'
import { useRef } from 'react'

import FestivalType from '../../../festivals/types/FestivalType'
import { DbImage } from 'src/components/DbImage'

import ArrowIcon from 'public/icons/common/arrow_right.svg'

type Props = {
  festival: FestivalType
  onSelect: Function
}

const FestivalsGridItem = ({ festival, onSelect }: Props) => {
  const ref = useRef(null)
  const { thumbnail } = festival

  return (
    <Flex
      direction={{ base: 'column', lg: 'column' }}
      width="100%"
      h="100%"
      bg="white"
      borderBottom="2px solid"
      borderRight="2px solid"
      borderColor="black"
      cursor="pointer"
      onClick={() => onSelect(festival)}
      _hover={{
        '.bottom-container': {
          filter:
            'invert(57%) sepia(82%) saturate(2505%) hue-rotate(359deg) brightness(92%) contrast(105%)',
        },
      }}
    >
      <Box
        flex={{ base: '0 1 36%', lg: 1 }}
        position="relative"
        width="100%"
        ref={ref}
      >
        <DbImage
          data={thumbnail}
          format="small"
          props={(image) => ({
            width: image.width,
            height: image.height,
            layout: 'responsive',
            objectFit: 'fill',
            objectPosition: 'center center',
          })}
        />
      </Box>
      <Flex
        className="bottom-container"
        flex={1}
        direction="column"
        justifyContent="space-between"
        p="24px 16px"
        color="black"
      >
        <Box pb="16px">
          <Text
            textTransform="uppercase"
            fontSize="l"
            fontFamily="iAWriterQuattroS"
            fontWeight={900}
            pb="4px"
          >
            {festival.title}
          </Text>
          <Text fontSize="l" fontFamily="iAWriterQuattroS">
            {festival.subtitle}
          </Text>
        </Box>
        <Box>
          <Image src={ArrowIcon} alt="" />
        </Box>
      </Flex>
    </Flex>
  )
}

export default FestivalsGridItem
