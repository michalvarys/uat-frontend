import styles from './FestivalsGrid.module.scss'

import FestivalType, {
  FestivalRelationship,
} from '../../../../festivals/types/FestivalType'
import FestivalGridItem from '../FestivalGridItem'

type Props = {
  festivals: (FestivalType | FestivalRelationship)[]
  onSelect(item: FestivalType): void
}

export const prepareFestivals = (
  festivals: (FestivalType | FestivalRelationship)[]
) => {
  if (!festivals?.length) {
    return []
  }

  return festivals.map((item: FestivalType | FestivalRelationship) => {
    if ('festival' in item) {
      return item.festival
    }

    return item
  })
}

const FestivalsGrid = ({ festivals: data, onSelect }: Props) => {
  const festivals = prepareFestivals(data)

  const renderGrid = () => {
    return festivals
      .slice(1, festivals.length)
      .map((item) => (
        <FestivalGridItem key={item.id} festival={item} onSelect={onSelect} />
      ))
  }

  return (
    <div className={styles.container}>
      <div>
        {festivals?.[0] ? (
          <FestivalGridItem festival={festivals[0]} onSelect={onSelect} />
        ) : (
          <></>
        )}
      </div>
      <div className={styles.grid}>
        {festivals.length > 1 ? renderGrid() : <></>}
      </div>
    </div>
  )
}

export default FestivalsGrid
