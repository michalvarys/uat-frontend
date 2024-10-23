import ImageType from '../../common/types/ImageType'
import TextWithImageType from '../../slices/types/TextWithImageType'
import FestivalPrizesType from './FestivalPrizesType'
import FestivalWinnerType from './FestivalWinner'

export type FestivalRelationship = {
  festival: FestivalType
  id: number
  title: string
}

type FestivalType = {
  id: number
  title: string
  subtitle: string
  description: string
  buttons: any[]
  thumbnail: ImageType
  image: ImageType
  cover_image: ImageType
  symbol: string
  date: string
  slogan: string
  content: TextWithImageType[]
  prizes: FestivalPrizesType
  localizations: any
  winners: {
    id: number
    single_winner: FestivalWinnerType[]
    year: string
  }[]
}

export default FestivalType
