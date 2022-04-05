import classNames from 'classnames';
import styles from './LanguageSelector.module.scss';

import { useApp } from '../../../../context/AppContext';

type Props = {
  isDark?: boolean,
};

const LanguageSelector = ({ isDark = false }: Props) => {
  const { currentLanguage, languages, setCurrentLanguage } = useApp();

  return (
    <div className={styles.container}>
      <div className={styles.items_container}>
        {languages.map((item) => (
          <span
            key={`lang_${item}`}
            className={classNames({
              [styles.item]: true,
              [styles.active_item]: currentLanguage === item,
              [styles.active_item_dark]: isDark && currentLanguage === item,
            })}
            onClick={() => setCurrentLanguage(item)}
            >
            {item.toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
