import classNames from 'classnames';
import styles from './SegmentedControl.module.scss';

type Props = {
  current: number,
  onSelect: Function,
  items: Array<string>,
};

const SegmentedControl = ({ current, onSelect, items }: Props) => (
  <div className={styles.container}>
    {items.map((item: string, idx: number) => (
      <div
        key={`segmented-control-${idx}`}
        className={classNames({
          [styles.button]: true,
          [styles.button_selected]: current === idx,
        })}
        onClick={() => onSelect(idx)}
      >
        {item}
      </div>
    ))}
  </div>
);

export default SegmentedControl;
