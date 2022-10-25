import { ShortTextType } from 'src/types/fieldsOfStudy'

type ApplicationsSectionType = {
  id: number
  list: ShortTextType[]
  title: string
}

type ApplicationsAtUniversityType = {
  id: number
  header: string
  sections: ApplicationsSectionType[]
}

export default ApplicationsAtUniversityType

export type { ApplicationsAtUniversityType, ApplicationsSectionType }
