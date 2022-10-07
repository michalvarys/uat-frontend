import Link from 'next/link'
import Image from 'next/image'

import SocialLinkType from '../../../types/data/SocialLinkType'
import SocialLinks from '../../navigation/SocialLinks'
import NewsType from '../types/NewsType'

import styles from './ImportantNewsRibbon.module.scss'

import RightArrowIcon from '../../../public/icons/common/arrow_right.svg'

type Props = {
  news: NewsType[]
  facebook: SocialLinkType
  instagram: SocialLinkType
  youtube: SocialLinkType
}

const ImportantNewsRibbon = ({ news, facebook, instagram, youtube }: Props) => (
  <div className={styles.container}>
    <div className={styles.wave} />
    <SocialLinks
      facebook={facebook}
      instagram={instagram}
      youtube={youtube}
      isDark
    />
    <div className={styles.links}>
      {news.map((item: NewsType) => (
        <Link key={item.id} href={`/news/${item.slug}`} passHref>
          <div className={styles.single_link}>
            <span>{item.title}</span>
            <Image src={RightArrowIcon} alt="" />
          </div>
        </Link>
      ))}
    </div>
  </div>
)

export default ImportantNewsRibbon
