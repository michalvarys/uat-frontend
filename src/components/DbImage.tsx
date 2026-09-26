'use client'

import ImageType, { ImageTypeProps } from './common/types/ImageType'
import { getAttributes } from 'src/utils/data'
import Image, { ImageProps } from 'next/image'
import { transformLink } from 'src/utils/link'
import { useMemo } from 'react'

/**
 * Props z Next.js 11, které v moderním next/image už neexistují.
 * Volající je po celém projektu používají, proto je DbImage přijímá
 * a překládá na CSS ekvivalenty (viz toModernProps).
 */
type LegacyImageProps = {
  layout?: 'fill' | 'responsive' | 'intrinsic' | 'fixed'
  objectFit?: React.CSSProperties['objectFit']
  objectPosition?: React.CSSProperties['objectPosition']
}

type DbImageProps = Partial<ImageProps> & LegacyImageProps

type PropsFn = (image: ImageTypeProps) => DbImageProps
type Props = {
  data: ImageType
  props?: DbImageProps | PropsFn
  format?: 'large' | 'medium' | 'small' | 'thumbnail'
}

/**
 * Převede props ve stylu Next 11 na moderní next/image.
 *
 *   layout="fill"        -> fill (rodič musí mít position: relative)
 *   layout="responsive"  -> width/height + style pro roztažení na šířku
 *   objectFit/Position   -> style
 */
function toModernProps(
  props: DbImageProps,
  fallback: { width?: number; height?: number }
): Partial<ImageProps> {
  const { layout, objectFit, objectPosition, style, ...rest } = props

  const objectStyle: React.CSSProperties = {
    ...(objectFit ? { objectFit } : {}),
    ...(objectPosition ? { objectPosition } : {}),
  }

  if (layout === 'fill') {
    return {
      ...rest,
      fill: true,
      style: { ...objectStyle, ...style },
    }
  }

  if (layout === 'responsive' || layout === 'intrinsic') {
    return {
      ...rest,
      width: rest.width ?? fallback.width,
      height: rest.height ?? fallback.height,
      style: {
        width: '100%',
        height: 'auto',
        ...objectStyle,
        ...style,
      },
    }
  }

  // layout="fixed" i chybějící layout se chovají stejně: rozměry beze změny.
  return {
    ...rest,
    width: rest.width ?? fallback.width,
    height: rest.height ?? fallback.height,
    style: { ...objectStyle, ...style },
  }
}

export function DbImage({ data, format, props: getProps }: Props) {
  const img = getAttributes(data)
  const image = useMemo(() => {
    if (!format || !img || !img.formats) {
      return img
    }

    let image = img
    if (img.formats[format]) {
      image = img.formats[format]
    } else if (img.formats.small) {
      image = img.formats.small
    } else if (img.formats.thumbnail) {
      image = img.formats.thumbnail
    }

    return image
  }, [format, img])

  if (!image) {
    return null
  }

  const rawProps = typeof getProps === 'function' ? getProps(image) : getProps
  const props = toModernProps(rawProps || {}, {
    width: image.width,
    height: image.height,
  })

  return (
    <Image
      src={transformLink(image.url)}
      {...props}
      // alt je až za {...props} schválně: volající může předat alt:
      // undefined a to by ošetřenou hodnotu přepsalo zpět na nic.
      // next/image alt vyžaduje, prázdný řetězec značí dekorativní obrázek.
      alt={(props as { alt?: string }).alt ?? img.alternativeText ?? ''}
    />
  )
}
