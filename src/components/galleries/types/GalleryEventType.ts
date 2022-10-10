import ImageType from '../../common/types/ImageType'
import { GalleryType } from '../../slices/types/GalleryType'

type GalleryEventType = {
  id: number
  title: string
  subtitle?: string
  description: string
  date: string
  image: ImageType
  cover_image?: ImageType
  gallery?: GalleryType
  localizations: any
}

export type { GalleryEventType }
