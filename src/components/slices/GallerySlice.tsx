import Image from 'next/image'
import { useState } from 'react'
import { GalleryItemType, GalleryType } from './types/GalleryType'
import Modal from '../common/Modal'
import ArrowRightIcon from 'public/icons/common/arrow_right.svg'
import { DbImage } from 'src/components/DbImage'
import { Box, Flex, IconButton } from '@chakra-ui/react'
type Props = {
  data: GalleryType
  isSmall?: boolean
}

type GalleryItemProps = {
  data: GalleryItemType
  isSmall: boolean
  onSelect: (item: GalleryItemType) => void
}

const GalleryItem = ({ data, isSmall, onSelect }: GalleryItemProps) => {
  return (
    <Box
      onClick={() => onSelect(data)}
      cursor="pointer"
      flexBasis={{ base: '100%', sm: '50%', md: '33.33%', lg: '25%' }}
      padding="3px"
    >
      <Box position="relative" paddingTop="75%" width="100%">
        <DbImage
          data={data.thumbnail_410x551}
          format="small"
          props={(img) => ({
            // height: img.height,
            // width: img.width,
            layout: 'fill',
            objectFit: 'fill',
            objectPosition: '50% 30%',
          })}
        />
      </Box>
    </Box>
  )
}

const GallerySlice = ({ data, isSmall = false }: Props) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(-1)
  const onSelectImage = (idx: number) => {
    setSelectedItemIndex(idx)
  }

  const onNextImage = () => {
    if (selectedItemIndex < data.gallery_item.length - 1) {
      setSelectedItemIndex(selectedItemIndex + 1)
    }
  }

  const onPrevImage = () => {
    if (selectedItemIndex > 0) {
      setSelectedItemIndex(selectedItemIndex - 1)
    }
  }

  const renderFullsizeImage = () => {
    return (
      <Modal
        isImageStyle
        isOpen={selectedItemIndex > -1}
        onClose={() => setSelectedItemIndex(-1)}
      >
        <Flex
          direction="column"
          minWidth="320px"
          height="100%"
          maxHeight="inherit"
          overflow="hidden"
          position="relative"
        >
          <Box flex={1} maxHeight="inherit">
            <DbImage
              data={data.gallery_item?.[selectedItemIndex].fullsize}
              props={(image) => ({
                width: image.width,
                height: image.height,
                objectFit: 'contain',
                objectPosition: 'center top',
              })}
            />
          </Box>
          <IconButton
            icon={
              <Image src={ArrowRightIcon} alt="next" width={20} height={20} />
            }
            aria-label="Next image"
            onClick={onNextImage}
            position="absolute"
            right="24px"
            top="calc(50% - 27px)"
            bg="rgba(255, 255, 255, 0.7)"
            borderRadius="full"
            size="lg"
          />
          <IconButton
            icon={
              <Image
                src={ArrowRightIcon}
                alt="previous"
                width={20}
                height={20}
              />
            }
            aria-label="Previous image"
            onClick={onPrevImage}
            position="absolute"
            left="24px"
            top="calc(50% - 27px)"
            bg="rgba(255, 255, 255, 0.7)"
            borderRadius="full"
            size="lg"
            transform="rotate(180deg)"
          />
        </Flex>
      </Modal>
    )
  }

  return (
    <Flex flexWrap="wrap" margin="-3px">
      {data.gallery_item.map((item, idx) => (
        <GalleryItem
          isSmall={isSmall}
          key={`gallery_item${item.id}`}
          data={item}
          onSelect={() => onSelectImage(idx)}
        />
      ))}
      {selectedItemIndex > -1 && renderFullsizeImage()}
    </Flex>
  )
}

export default GallerySlice
