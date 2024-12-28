import ImageType from '../../common/types/ImageType'

type PageType = {
  id: number
  attributes: {
    title: string
    cover_image: ImageType
    slug: string
    sections: any[]
    locale: string
    localizations: { data: PageType[] }
  }
}

export default PageType
