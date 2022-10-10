import Image from 'next/image'
import styles from './HeaderSlice.module.scss'

import { transformLink } from 'src/utils/link'
import ImageType from '../../common/types/ImageType'
import ImportantNewsRibbon from '../../news/ImportantNewsRibbon'
import NewsType from '../../news/types/NewsType'
import SocialLinkType from '../../../types/data/SocialLinkType'
import { chakra } from '@chakra-ui/react'
import { HeaderImage } from './HeaderImage'

type Props = {
  title?: string
  subtitle?: string
  image: ImageType
  logo: ImageType
  news: NewsType[]
  facebook: SocialLinkType
  instagram: SocialLinkType
  youtube: SocialLinkType
}

const HeaderSlice = ({
  news,
  title,
  subtitle,
  image,
  logo,
  facebook,
  instagram,
  youtube,
}: Props) => {
  return (
    <chakra.div overflow="hidden" className={styles.container}>
      <HeaderImage image={image} />

      <div className={styles.title_container}>
        <chakra.div className={styles.logo}>
          {logo ? (
            <Image
              src={transformLink(logo.url)}
              alt={logo.alternativeText}
              width={logo.width}
              height={logo.height}
            />
          ) : (
            <></>
          )}
        </chakra.div>

        <chakra.span
          fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}
          lineHeight={{ base: '38px', md: '48px', lg: '58px' }}
          className={styles.title}
        >
          {title}
        </chakra.span>
        <chakra.span
          fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}
          lineHeight={{ base: '38px', md: '48px', lg: '58px' }}
          className={styles.subtitle}
        >
          {subtitle}
        </chakra.span>
      </div>

      <div className={styles.important_news}>
        <ImportantNewsRibbon
          news={news}
          facebook={facebook}
          instagram={instagram}
          youtube={youtube}
        />
      </div>
    </chakra.div>
  )
}

export default HeaderSlice
