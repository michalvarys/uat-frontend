import Image, { ImageProps } from 'next/image'
import { chakra, useBreakpointValue } from '@chakra-ui/react'

import ImageType from 'src/components/common/types/ImageType'
import { transformLink } from 'src/utils/link'
import { useLandscape } from 'src/hooks/responsivity'

type Props = {
  image: ImageType
}

export function HeaderImage({ image }: Props) {
  const isLandscape = useLandscape()
  const imgPos = useBreakpointValue<ImageProps['objectPosition']>(
    {
      base: '70px center',
      md: '20px center',
      lg: 'center center',
    },
    { fallback: 'base', ssr: false }
  )

  const imgFit = useBreakpointValue<ImageProps['objectFit']>(
    {
      base: 'contain',
      lg: 'cover',
    },
    { fallback: 'base', ssr: false }
  )

  const imgTransform = useBreakpointValue(
    {
      base: 'scale(2)',
      lg: 'none',
    },
    { fallback: 'base', ssr: false }
  )

  return (
    <chakra.div
      h="full"
      sx={{
        img: {
          transform: imgTransform,
          top: isLandscape ? '-50% !important' : 0,
        },
        '> div': {
          minH: 'full',
        },
      }}
    >
      {image && 'url' in image && (
        <Image
          src={transformLink(image.url)}
          alt={image.alternativeText}
          width={image.width}
          height={image.height}
          objectFit={imgFit}
          objectPosition={imgPos}
        />
      )}
    </chakra.div>
  )
}
