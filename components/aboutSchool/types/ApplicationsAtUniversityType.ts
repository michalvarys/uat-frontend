import type { ShortTextType } from '../../fields/types/SubjectsType';

type ApplicationsSectionType = {
  id: number,
  list: Array<ShortTextType>,
  title: string,
}

type ApplicationsAtUniversityType = {
  id: number,
  header: string,
  sections: Array<ApplicationsSectionType>,
};

export default ApplicationsAtUniversityType;

export type {
  ApplicationsAtUniversityType,
  ApplicationsSectionType,
}
