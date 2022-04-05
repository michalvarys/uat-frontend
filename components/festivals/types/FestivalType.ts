import ImageType from '../../common/types/ImageType';
import TextWithImageType from '../../slices/types/TextWithImageType';
import FestivalPrizesType from './FestivalPrizesType';
import FestivalWinnerType from './FestivalWinner';

type FestivalType = {
  id: number,
  title: string,
  subtitle: string,
  description: string,
  buttons: Array<any>,
  thumbnail: ImageType,
  image: ImageType,
  cover_image: ImageType,
  symbol: string,
  date: string,
  slogan: string,
  content: Array<TextWithImageType>,
  prizes: FestivalPrizesType,
  localizations: any,
  winners: Array<{
    id: number,
    single_winner: Array<FestivalWinnerType>,
    year: string,
  }>
};

export default FestivalType;
