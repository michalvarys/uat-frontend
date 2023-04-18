import Image from 'next/image'

import styles from './ImageButton.module.scss'
import { ImageButtonVariant } from './ImageButtonVariant'
import { chakra } from '@chakra-ui/react'

type Props = {
  image: any
  title: string
  variant: ImageButtonVariant
}

const getVariantStyle = (variant: ImageButtonVariant): string => {
  switch (variant) {
    case ImageButtonVariant.Black:
      return styles.container_black
    case ImageButtonVariant.White:
      return styles.container_white
    default:
      return styles.container_white
  }
}

const ImageButton = ({ image, title, variant }: Props) => {
  return (
    // TODO use chakra styles
    <chakra.div className={`${styles.container}  ${getVariantStyle(variant)}`}>
      <chakra.span className={styles.title}>{title}</chakra.span>
      <Image src={image} alt="icon" />
    </chakra.div>
  )
}

ImageButton.defaultProps = {
  variant: ImageButtonVariant.White,
}

export default ImageButton
