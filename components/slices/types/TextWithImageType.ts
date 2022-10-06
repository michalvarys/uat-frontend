import ImageType from '../../common/types/ImageType'
import LinkType from '../../navigation/types/LinkType'

type TextWithImageType = {
  id?: number
  title: string
  subtitle?: string
  content: string
  left_side_image: boolean
  download_link?: LinkType
  link?: LinkType
  image: ImageType
}

export default TextWithImageType
