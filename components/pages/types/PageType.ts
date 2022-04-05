import ImageType from '../../common/types/ImageType';

type PageType = {
  id: number,
  title: string,
  cover_image: ImageType,
  slug: string,
  sections: Array<any>,
  localizations: any,
};

export default PageType;
