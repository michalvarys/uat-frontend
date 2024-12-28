import ImageType, { ImageTypeProps } from './common/types/ImageType'
import { getAttributes } from 'src/utils/data'
import Image, { ImageProps } from 'next/image'
import { transformLink } from 'src/utils/link'
import { useMemo } from 'react'

type PropsFn = (image: ImageTypeProps) => Partial<ImageProps>
type Props = {
  data: ImageType
  props?: Partial<ImageProps> | PropsFn
  format?: 'large' | 'medium' | 'small' | 'thumbnail'
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

  const props = typeof getProps === 'function' ? getProps(image) : getProps
  return (
    <Image
      alt={img.alternativeText}
      src={transformLink(image.url)}
      {...(props || { width: image.width, height: image.height })}
    />
  )
}
