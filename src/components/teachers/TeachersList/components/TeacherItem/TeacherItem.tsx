'use client'

import Image from 'next/image'

import styles from './TeacherItem.module.scss'

import TeacherType from '../../../types/TeacherType'
import { transformLink } from 'src/utils/link'

import SlantArrowIcon from 'public/icons/common/arrow_slant.svg'
import { useMemo } from 'react'
import { DbImage } from 'src/components/DbImage'

type Props = {
  isFixed?: boolean
  item: TeacherType
  onSelect: (item: TeacherType) => void
}

const TeacherItem = ({ isFixed = false, item, onSelect }: Props) => {
  // const thumbnailPath = useMemo(() => {
  //   if (!item.photo_340x609) {
  //     return null
  //   }

  //   let url = item.photo_340x609.url
  //   if (item?.photo_340x609?.formats?.small) {
  //     url = item.photo_340x609.formats.small.url
  //   } else if (item?.photo_340x609?.formats?.thumbnail) {
  //     url = item.photo_340x609.formats.thumbnail.url
  //   }

  //   return url
  // }, [item.photo_340x609])

  // if (!thumbnailPath) {
  //   return null
  // }

  return (
    <div
      className={`${styles.container} ${isFixed ? styles.fixed_container : ''}`}
      onClick={() => onSelect(item)}
    >
      <div className={styles.image_container}>
        <DbImage
          data={item.photo_340x609}
          format="small"
          props={{
            layout: 'fill',
            objectFit: 'cover',
            objectPosition: '50% 0%',
          }}
        />
      </div>
      <div className={styles.bottom_container}>
        <span className={styles.name}>
          {`${item.title ? `${item.title} ` : ''}${item.firstname} ${
            item.surname
          }`}
        </span>
        {/* Funkce se v CMS plní do extra_role; pole post zůstalo
            z dřívějška prázdné u všech pedagogů. Detail v modálním okně
            ukazuje extra_role, karta v seznamu tedy taky — jinak by se
            funkce dala zjistit jen po rozkliknutí. */}
        {(item.extra_role || item.post)?.trim() && (
          <span className={styles.post}>{item.extra_role || item.post}</span>
        )}
        <div className={styles.arrow}>
          <Image src={SlantArrowIcon} alt="" />
        </div>
      </div>
    </div>
  )
}

export default TeacherItem
