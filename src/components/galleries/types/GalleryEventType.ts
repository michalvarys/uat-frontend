import type { SeoComponent } from 'src/utils/seo'
import ImageType from '../../common/types/ImageType'
import { GalleryType } from '../../slices/types/GalleryType'

type GalleryEventType = {
  seo?: SeoComponent | null
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
