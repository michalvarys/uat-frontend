import ImageType from '../../common/types/ImageType'

type PageType = {
  id: number
  title: string
  cover_image: ImageType
  slug: string
  sections: any[]
  locale: string
  localizations: PageType[]
}

export default PageType
