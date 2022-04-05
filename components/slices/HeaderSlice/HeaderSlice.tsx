import Image from 'next/image';
import styles from './HeaderSlice.module.scss';

import { transformLink } from '../../../utils/transformLink';
import ImageType from '../../common/types/ImageType';
import ImportantNewsRibbon from '../../news/ImportantNewsRibbon';
import NewsType from '../../news/types/NewsType';
import SocialLinkType from '../../../types/data/SocialLinkType';

type Props = {
  title?: string,
  subtitle?: string,
  image: ImageType,
  logo: ImageType,
  news: Array<NewsType>,
  facebook: SocialLinkType,
  instagram: SocialLinkType,
  youtube: SocialLinkType,
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
    <div className={styles.container}>
      <div className={styles.image_container}>
        {image ? (
          <Image
            src={transformLink(image.url)}
            alt={image.alternativeText}
            width={image.width}
            height={image.height}
            objectFit={'cover'}
            objectPosition={'-40px center'}
          />
        ) : <></>}
      </div>
      <div className={styles.title_container}>
        <div className={styles.logo}>
        {logo ? (
          <Image
            src={transformLink(logo.url)}
            alt={logo.alternativeText}
            width={logo.width}
            height={logo.height}
          />
        ) : <></>}
        </div>
        <span className={styles.title}>{title}</span>
        <span className={styles.subtitle}>{subtitle}</span>
      </div>
      <div className={styles.important_news}>
        <ImportantNewsRibbon
          news={news}
          facebook={facebook}
          instagram={instagram}
          youtube={youtube}
        />
      </div>
    </div>
  );
};

export default HeaderSlice;
