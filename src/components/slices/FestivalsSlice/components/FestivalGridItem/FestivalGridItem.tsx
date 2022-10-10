import Image from 'next/image'

import styles from './FestivalGridItem.module.scss'

import { transformLink } from 'src/utils/link'
import FestivalType from '../../../../festivals/types/FestivalType'

import ArrowIcon from 'public/icons/common/arrow_right.svg'

type Props = {
  festival: FestivalType
  onSelect: Function
}

const FestivalsGridItem = ({ festival, onSelect }: Props) => {
  const { thumbnail } = festival
  return (
    <div className={styles.container} onClick={() => onSelect(festival)}>
      <div className={styles.image}>
        {thumbnail && (
          <Image
            src={transformLink(thumbnail.url)}
            layout={'fill'}
            objectFit={'cover'}
            objectPosition={'center center'}
            alt={thumbnail.alternativeText}
          />
        )}
      </div>
      <div className={styles.bottom_container}>
        <div className={styles.content}>
          <span className={styles.title}>{festival.title}</span>
          <span className={styles.subtitle}>{festival.subtitle}</span>
        </div>
        <div className={styles.arrow}>
          <Image src={ArrowIcon} alt="" />
        </div>
      </div>
    </div>
  )
}

export default FestivalsGridItem
