
import styles from './FestivalsGrid.module.scss';

import FestivalType from '../../../../festivals/types/FestivalType';
import FestivalGridItem from '../FestivalGridItem';

type Props = {
  festivals: Array<FestivalType>,
  onSelect: Function,
}

const FestivalsGrid = ({ festivals, onSelect }: Props) => {

  const renderGrid = () => {
    return festivals.slice(1, festivals.length).map((item: FestivalType) => (
      <FestivalGridItem
        key={item.id}
        festival={item}
        onSelect={onSelect}
      />
    ) );
  }

  return (
    <div className={styles.container}>
      <div>
        {festivals.length > 0 ? (
          <FestivalGridItem
            festival={festivals[0]}
            onSelect={onSelect}
          />
        ) : <></>}
      </div>
      <div className={styles.grid}>
        {festivals.length > 1 ? renderGrid() : <></>}
      </div>
    </div>
  );
};

export default FestivalsGrid;
