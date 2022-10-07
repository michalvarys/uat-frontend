import type { ShortTextType } from '../../fields/types/SubjectsType'

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
