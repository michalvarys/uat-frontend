import ImageType from '../../common/types/ImageType';

type SponsorType = {
  id: number,
  image: ImageType,
  text: string,
}

type ShortTextType = {
  id: number,
  text: string,
}

type SubjectsSectionType = {
  id: number,
  list: Array<ShortTextType>,
  title: string,
}

type SubjectsType = {
  header: string,
  id: number,
  sections: Array<SubjectsSectionType>,
  sponsor: SponsorType;
}

export default SubjectsType;

export type {
  SponsorType,
  ShortTextType,
  SubjectsSectionType,
};

