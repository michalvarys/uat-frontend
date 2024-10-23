import ImageType from '../../common/types/ImageType'

type TeacherType = {
  bio: string
  extra_role?: string
  firstname: string
  id: number
  photo_340x609: ImageType
  post: string
  surname: string
  title: string
  sort: number
}

export default TeacherType
