import type { SeoComponent } from 'src/utils/seo'
import UATGalleryType from '../../slices/types/UATGalleryType'
import { GalleryEventType } from './GalleryEventType'

type GalleriesOverviewType = {
  seo?: SeoComponent | null
  id: number
  description: string
  galleryEvents: GalleryEventType[]
  galleries_uat: UATGalleryType[]
  subtitle: string
  title: string
}

export default GalleriesOverviewType
