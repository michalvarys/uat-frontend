import Image from 'next/image'

import styles from './TeacherItem.module.scss'

import TeacherType from '../../../types/TeacherType'
import { transformLink } from 'src/utils/link'

import SlantArrowIcon from 'public/icons/common/arrow_slant.svg'
import { useMemo } from 'react'

type Props = {
  isFixed?: boolean
  item: TeacherType
  onSelect: (item: TeacherType) => void
}

const TeacherItem = ({ isFixed = false, item, onSelect }: Props) => {
  const thumbnailPath = useMemo(() => {
    if (!item.photo) {
      return null
    }

    let url = item.photo.url
    if (item?.photo?.formats?.small) {
      url = item.photo.formats.small.url
    } else if (item?.photo?.formats?.thumbnail) {
      url = item.photo.formats.thumbnail.url
    }

    return url
  }, [item.photo])

  if (!item.id) {
    return null
  }

  return (
    <div
      className={`${styles.container} ${isFixed ? styles.fixed_container : ''}`}
      onClick={() => onSelect(item)}
    >
      <div className={styles.image_container}>
        {thumbnailPath && (
          <Image
            src={transformLink(thumbnailPath)}
            alt={item.photo?.alternativeText}
            layout={'fill'}
            objectFit={'cover'}
            objectPosition={'50% 0%'}
          />
        )}
      </div>
      <div className={styles.bottom_container}>
        <span className={styles.name}>
          {`${item.title ? `${item.title} ` : ''}${item.firstname} ${
            item.surname
          }`}
        </span>
        <span className={styles.post}>{item.post}</span>
        <div className={styles.arrow}>
          <Image src={SlantArrowIcon} alt="" />
        </div>
      </div>
    </div>
  )
}

export default TeacherItem
