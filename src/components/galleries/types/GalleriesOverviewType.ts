import UATGalleryType from '../../slices/types/UATGalleryType'
import { GalleryEventType } from './GalleryEventType'

type GalleriesOverviewType = {
  id: number
  description: string
  galleryEvents: GalleryEventType[]
  galleries_uat: UATGalleryType[]
  subtitle: string
  title: string
}

export default GalleriesOverviewType
