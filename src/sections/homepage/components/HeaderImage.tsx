'use client'

import Image from 'next/image'
import type { CSSProperties } from 'react'
import { chakra, useBreakpointValue } from '@chakra-ui/react'

import ImageType from 'src/components/common/types/ImageType'
import { transformLink } from 'src/utils/link'
import { useLandscape } from 'src/hooks/responsivity'

type Props = {
  image: ImageType
}

export function HeaderImage({ image }: Props) {
  const isLandscape = useLandscape()
  // Hodnoty odpovídají tomu, co reálně vykresluje uat.sk: na úzkých
  // displejích se fotka zmenšuje celá (contain) a zvětšuje transformem,
  // na širokých vyplňuje rám v původním poměru (fill).
  const imgFit = useBreakpointValue<CSSProperties['objectFit']>(
    {
      base: 'contain',
      lg: 'fill',
    },
    { fallback: 'base', ssr: true }
  )

  const imgTransform = useBreakpointValue(
    {
      base: 'scale(2)',
      lg: 'none',
    },
    { fallback: 'base', ssr: true }
  )

  return (
    <chakra.div
      h="full"
      sx={{
        img: {
          transform: imgTransform,
          top: isLandscape ? '-50% !important' : 0,
        },
        // Next 11 obaloval obrázek vlastními <div> a ty mu držely rozměry
        // rámu. Moderní next/image žádný obal nevytváří, takže si je musí
        // vzít sám — jinak se vykreslí v původním poměru stran, přeteče
        // rám s overflow: hidden a je vidět jen jeho horní část.
        '& > img': {
          w: 'full',
          h: 'full',
          objectFit: imgFit,
        },
      }}
    >
      {image && 'url' in image && (
        <Image
          src={transformLink(image.url)}
          alt={image.alternativeText || ''}
          width={image.width}
          height={image.height}
          // Pozor: v Next 11 se objectFit/objectPosition bez `layout`
          // vůbec neuplatnily, obrázek se roztahoval na rozměry rámu
          // (object-fit: fill). Převod na style by je poprvé aktivoval
          // a ořízl hlavní fotku na homepage jinak než na uat.sk.
          // Vzhled proto zůstává, jak ho uživatelé znají.
        />
      )}
    </chakra.div>
  )
}
