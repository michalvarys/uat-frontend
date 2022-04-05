import classNames from 'classnames';
import styles from './SearchBox.module.scss';

type Props = {
  currentValue: string,
  onChange: Function,
  placeholder?: string,
};

const SearchBox = ({ currentValue, onChange, placeholder }: Props) => (
  <div className={styles.container}>
    <input
      className={styles.input}
      type="text"
      placeholder={placeholder}
      value={currentValue}
      onChange={(e) => onChange(e.currentTarget.value)}
    />
  </div>
);

export default SearchBox;
