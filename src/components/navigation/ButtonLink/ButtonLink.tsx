'use client'

import Link, { LinkProps } from 'next/link'

import DownloadIcon from 'public/icons/common/download.svg'
import DownloadDarkIcon from 'public/icons/common/download_dark.svg'
import ArrowIcon from 'public/icons/common/arrow_right_light.svg'
import ArrowDarkIcon from 'public/icons/common/arrow_right.svg'

import { isExternalLink, transformLink } from 'src/utils/link'
import { DEFAULT_LOCALE } from 'src/i18n/config'
import { ButtonLinkVariant } from './ButtonLinkVariant'
import { ButtonLinkImageType } from './ButtonLinkImageType'
import { chakra } from '@chakra-ui/react'
import ImageButton, {
  ImageButtonVariant,
} from 'src/components/common/buttons/ImageButton'

type Props = {
  title: string
  path?: string
  variant?: ButtonLinkVariant
  imageType?: ButtonLinkImageType
  link?: LinkProps
  target?: '_blank' | '_self'
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

const ButtonLink = ({
  imageType = ButtonLinkImageType.Arrow,
  variant = ButtonLinkVariant.White,
  path = '',
  title,
  link,
  target,
}: Props) => {
  const url =
    imageType === ButtonLinkImageType.Download ? transformLink(path) : path

  const isExternal = isExternalLink(url)
  const icon = getButtonIcon(variant, imageType, isExternal)
  const linkTarget =
    !link && (imageType === ButtonLinkImageType.Download || isExternal)
      ? '_blank'
      : '_self'

  return (
    // Next 16 nepodporuje <Link> s vnořeným <a> ani passHref.
    // Prop `locale` na Linku také skončil — jazyk je nově součástí cesty,
    // proto ho pro odkazy na cizojazyčné záznamy doplňuje localizedHref.
    <chakra.a
      as={Link}
      href={localizedHref(link?.href || url?.trim() || '#', link?.locale)}
      target={target || linkTarget}
    >
      <ImageButton
        title={title}
        image={icon}
        variant={getButtonVariant(variant)}
      />
    </chakra.a>
  )
}

/**
 * Doplní jazykový prefix do cíle odkazu.
 *
 * Dřív se jazyk předával Linku jako prop `locale`, ten ale v Next 16 není.
 * Slovenština běží bez prefixu, ostatní jazyky s ním.
 */
function localizedHref(href: LinkProps['href'], locale?: string | false) {
  if (!locale || typeof locale !== 'string' || locale === DEFAULT_LOCALE) {
    return href
  }

  if (typeof href === 'string') {
    return `/${locale}${href.startsWith('/') ? href : `/${href}`}`
  }

  return {
    ...href,
    pathname: href.pathname ? `/${locale}${href.pathname}` : href.pathname,
  }
}

ButtonLink.defaultProps = {
  variant: ButtonLinkVariant.White,
}

export default ButtonLink
