import { useState } from 'react'
import GallerySlice from '../GallerySlice'
import { GalleryType } from '../types/GalleryType'
import GalleryMenu from './components/GalleryMenu'

import styles from './MultiGallerySlice.module.scss'

type Props = {
  galleries: GalleryType[]
  isSmall?: boolean
}

const MultiGallerySlide = ({ galleries, isSmall = false }: Props) => {
  const [currentGallery, setCurrentGallery] = useState<number>(
    galleries && galleries.length > 0 ? 0 : -1
  )

  if (!galleries || galleries.length === 0) {
    return null
  }

  return (
    <div className={styles.gallery_container}>
      <GalleryMenu
        names={galleries.map(
          (item: GalleryType, idx: number) => item.title || `Gallery #${idx}`
        )}
        current={currentGallery}
        onChange={(newValue) => setCurrentGallery(newValue)}
      />
      <GallerySlice data={galleries[currentGallery]} isSmall={isSmall} />
    </div>
  )
}

export default MultiGallerySlide
