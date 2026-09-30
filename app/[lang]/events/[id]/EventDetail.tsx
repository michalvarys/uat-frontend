'use client'


import Container, { ContainerVariant } from 'src/components/common/Container'
import { GalleryEventType } from 'src/components/galleries/types/GalleryEventType'
import GallerySlice from 'src/components/slices/GallerySlice'
import { DbImage } from 'src/components/DbImage'

import styles from '../events.module.scss'
import { CmsContent } from 'src/components/CmsContent'

type Props = {
  event: GalleryEventType
}

export default function EventDetail({ event }: Props) {
  const { cover_image, description, gallery } = event

  return (
    <Container variant={ContainerVariant.Black}>
      <div className={styles.cover_image}>
        <DbImage
          data={cover_image}
          props={{
            layout: 'fill',
            objectFit: 'cover',
            objectPosition: '50% 30%',
          }}
        />
      </div>
      <div className={styles.container}>
        <div className={styles.title}>
          <h1 className={styles.header}>{event.title}</h1>
        </div>
        {description && (
          <div className={styles.description_content}>
            <CmsContent data={description} />
          </div>
        )}
      </div>
      <div className={styles.bottom_container}>
        {gallery && <GallerySlice data={gallery} isSmall />}
      </div>
    </Container>
  )
}
