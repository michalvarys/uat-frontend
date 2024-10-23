import ImageType from '../../common/types/ImageType'

type GalleryItemType = {
  id: number
  fullsize: ImageType
  thumbnail_410x551: ImageType
}

type GalleryType = {
  id: number
  title?: string
  gallery_item: GalleryItemType[]
}

export type { GalleryItemType, GalleryType }
