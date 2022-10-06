import ImageType from '../../common/types/ImageType'
import { GalleryType } from '../../slices/types/GalleryType'
import TextWithImageType from '../../slices/types/TextWithImageType'
import TeacherType from '../../teachers/types/TeacherType'

type FieldOfStudyType = {
  id: number
  name: string
  buttons: any[]
  code: string
  short_description: string
  description?: string
  image: ImageType
  icon_svg: ImageType
  content: TextWithImageType[]
  galleries: GalleryType[]
  teachers: TeacherType[]
  localizations: any
}

export default FieldOfStudyType
