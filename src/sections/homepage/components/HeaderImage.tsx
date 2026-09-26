'use client'

import Image from 'next/image'
import { chakra, useBreakpointValue } from '@chakra-ui/react'

import ImageType from 'src/components/common/types/ImageType'
import { transformLink } from 'src/utils/link'
import { useLandscape } from 'src/hooks/responsivity'

type Props = {
  image: ImageType
}

export function HeaderImage({ image }: Props) {
  const isLandscape = useLandscape()
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
        // Next 11 vkládal mezi rám a obrázek dva vlastní <div>: vnější
        // s min-height: 100% a display: inline-block, vnitřní prostý blok.
        // Obrázek se v nich vykreslil ve svém poměru stran (šířka rámu,
        // výška dopočítaná) a přebytek přetekl ven, kde ho ořízl rám
        // v HeaderSlice. Moderní next/image žádný obal nevytváří, proto ho
        // sem doplňujeme ručně — jinak se fotka zmáčkne do výšky okna.
        '& > div': {
          display: 'inline-block',
          minH: 'full',
          w: 'full',
          position: 'relative',
          // Obal si ořezává sám, stejně jako to dělal v Next 11 — díky
          // tomu je vidět celá fotka a rám v HeaderSlice jen omezuje,
          // kolik z ní zbude na výšku okna.
          overflow: 'hidden',
        },
        '& img': {
          // V Next 11 byl obrázek uvnitř obalu absolutně pozicovaný, takže
          // se na něm uplatnilo `top: -50 %` z pravidla výš a fotka se
          // posunula nahoru — proto je na uat.sk vidět obličej, ne jen
          // vlasy. Bez position: absolute zůstane `top` bez účinku.
          position: 'absolute',
          insetStart: 0,
          w: 'full',
          h: 'auto',
          // uat.sk má object-fit: fill na všech šířkách — fotka se
          // vykresluje ve svém poměru stran, takže se stejně nedeformuje.
          objectFit: 'fill',
        },
      }}
    >
      {image && 'url' in image && (
        <div>
          <Image
            src={transformLink(image.url)}
            alt={image.alternativeText || ''}
            width={image.width}
            height={image.height}
          />
        </div>
      )}
    </chakra.div>
  )
}
