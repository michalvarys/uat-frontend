import Link from 'next/link'

import styles from './ButtonLink.module.scss'

import DownloadIcon from 'public/icons/common/download.svg'
import DownloadDarkIcon from 'public/icons/common/download_dark.svg'
import ArrowIcon from 'public/icons/common/arrow_right_light.svg'
import ArrowDarkIcon from 'public/icons/common/arrow_right.svg'

import { isExternalLink, transformLink } from 'src/utils/link'
import { ButtonLinkVariant } from './ButtonLinkVariant'
import { ButtonLinkImageType } from './ButtonLinkImageType'
import ImageButton, {
  ImageButtonVariant,
} from 'src/components/common/buttons/ImageButton'

type Props = {
  title: string
  path: string
  variant: ButtonLinkVariant
  imageType: ButtonLinkImageType
}

const getButtonVariant = (variant: ButtonLinkVariant): ImageButtonVariant => {
  switch (variant) {
    case ButtonLinkVariant.Black:
      return ImageButtonVariant.Black
    case ButtonLinkVariant.White:
      return ImageButtonVariant.White
    default:
      return ImageButtonVariant.White
  }
}

const icons = {
  [ButtonLinkImageType.Arrow]: {
    [ButtonLinkVariant.White]: ArrowDarkIcon,
    [ButtonLinkVariant.Black]: ArrowIcon,
  },
  [ButtonLinkImageType.Download]: {
    [ButtonLinkVariant.White]: DownloadDarkIcon,
    [ButtonLinkVariant.Black]: DownloadIcon,
  },
}

const getButtonIcon = (
  variant: ButtonLinkVariant,
  imageType: ButtonLinkImageType,
  isExternal?: boolean
): any => {
  if (isExternal) {
    return icons[ButtonLinkImageType.Arrow][variant]
  }

  return icons[imageType] && icons[imageType][variant]
}

const ButtonLink = ({ imageType, title, path, variant }: Props) => {
  const url =
    imageType === ButtonLinkImageType.Download ? transformLink(path) : path

  const isExternal = isExternalLink(url)
  const icon = getButtonIcon(variant, imageType, isExternal)

  return (
    <Link href={url.trim()} passHref>
      <a
        className={styles.container}
        target={
          imageType === ButtonLinkImageType.Download || isExternal
            ? '_blank'
            : '_self'
        }
      >
        <ImageButton
          title={title}
          image={icon}
          variant={getButtonVariant(variant)}
        />
      </a>
    </Link>
  )
}

ButtonLink.defaultProps = {
  variant: ButtonLinkVariant.White,
}

export default ButtonLink
