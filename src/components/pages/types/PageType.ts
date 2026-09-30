import type { SeoComponent } from 'src/utils/seo'
import ImageType from '../../common/types/ImageType'

type PageType = {
  seo?: SeoComponent | null
  id: number
  title: string
  cover_image: ImageType
  slug: string
  sections: any[]
  locale: string
  localizations: PageType[]
}

export default PageType
