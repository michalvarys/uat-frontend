import Image from 'next/image'

import styles from './FestivalGridItem.module.scss'

import { transformLink } from 'src/utils/link'
import FestivalType from '../../../../festivals/types/FestivalType'

import ArrowIcon from 'public/icons/common/arrow_right.svg'
import { useEffect, useRef, useState } from 'react'

type Props = {
  festival: FestivalType
  onSelect: Function
}

const FestivalsGridItem = ({ festival, onSelect }: Props) => {
  const { thumbnail } = festival
  const ref = useRef(null)
  const image = thumbnail.formats.small

  return (
    <div className={styles.container} onClick={() => onSelect(festival)}>
      <div className={styles.image} ref={ref}>
        {thumbnail && (
          <Image
            src={transformLink(image.url)}
            layout={'responsive'}
            objectFit={'fill'}
            objectPosition={'center center'}
            width={image.width}
            height={image.height}
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
