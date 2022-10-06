import Image from 'next/image'
import Link from 'next/link'

import SocialLinkType from '../../../types/data/SocialLinkType'
import styles from './SocialLinks.module.scss'

import FacebookIcon from '../../../public/icons/social/facebook.svg'
import InstagramIcon from '../../../public/icons/social/instagram.svg'
import YoutubeIcon from '../../../public/icons/social/youtube.svg'

import FacebookDarkIcon from '../../../public/icons/social/facebook_dark.svg'
import InstagramDarkIcon from '../../../public/icons/social/instagram_dark.svg'
import YoutubeDarkIcon from '../../../public/icons/social/youtube_dark.svg'

type Props = {
  facebook: SocialLinkType
  instagram: SocialLinkType
  youtube: SocialLinkType
  isDark?: boolean
}

type SocialLinkProps = {
  social?: SocialLinkType
  image: any
}

const SocialLink = ({ social, image }: SocialLinkProps) => {
  if (social && social.isVisible) {
    return (
      // eslint-disable-next-line @next/next/link-passhref
      <Link href={social.url} as={social.url}>
        <div className={styles.single_link_container}>
          <Image src={image} alt="" />
        </div>
      </Link>
    )
  }
  return null
}

const SocialLinks = ({
  facebook,
  instagram,
  youtube,
  isDark = false,
}: Props) => {
  return (
    <div className={styles.container}>
      <SocialLink
        social={instagram}
        image={isDark ? InstagramDarkIcon : InstagramIcon}
      />
      <SocialLink
        social={facebook}
        image={isDark ? FacebookDarkIcon : FacebookIcon}
      />
      <SocialLink
        social={youtube}
        image={isDark ? YoutubeDarkIcon : YoutubeIcon}
      />
    </div>
  )
}

export default SocialLinks
