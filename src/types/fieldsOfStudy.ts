import { GalleryType } from 'src/components/slices/types/GalleryType'
import TextWithImageType from 'src/components/slices/types/TextWithImageType'
import TeacherType from 'src/components/teachers/types/TeacherType'
import ImageType from 'src/components/common/types/ImageType'

export type SponsorType = {
  id: number
  image: ImageType
  text: string
}

export type ShortTextType = {
  id: number
  text: string
}

export type SubjectsSectionType = {
  id: number
  list: ShortTextType[]
  title: string
}

export type SubjectsType = {
  header: string
  id: number
  sections: SubjectsSectionType[]
  sponsor: SponsorType
}

export type FieldOfStudyType = {
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
