import ImageType from '../../common/types/ImageType';

type FestivalWinnerType = {
  id: number,
  place: string,
  title: string,
  author: string,
  subtitle: string,
  image?: ImageType,
  link?: string,
};

export default FestivalWinnerType;
