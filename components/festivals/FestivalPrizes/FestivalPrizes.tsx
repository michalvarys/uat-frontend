import { useRouter } from 'next/router';
import styles from './FestivalPrizes.module.scss';

import FestivalPrizesType from '../types/FestivalPrizesType';
import { getString, Strings } from '../../../locales';


type Props = {
  prizes: FestivalPrizesType,
}

const FestivalPrizes = ({ prizes }: Props) => {
  const {
    first_prize,
    second_prize,
    third_prize,
    special_prize,
    honorable_mentions,
  } = prizes;

  const router = useRouter();
  return (
    <div className={styles.card_container}>
      {first_prize && (
        <div className={styles.item}>
          <div>
            <div className={styles.title}>1st prize</div>
            <div className={styles.value}>{first_prize}</div>
          </div>
        </div>
      )}
      {second_prize && (
        <div className={styles.item}>
          <div>
            <div className={styles.title}>2st prize</div>
            <div className={styles.value}>{second_prize}</div>
          </div>
        </div>
      )}
      {third_prize && (
        <div className={styles.item}>
          <div>
            <div className={styles.title}>3rd prize</div>
            <div className={styles.value}>{third_prize}</div>
          </div>
        </div>
      )}
      {(special_prize || honorable_mentions) && (
        <div className={styles.item}>
          {special_prize && (
          <div className={styles.special_container}>
            <div className={styles.special_value}>{getString(router.locale, Strings.SPECIAL_PRIZE)}</div>
          </div>
          )}
          {honorable_mentions && (
            <div className={styles.special_container}>
              <div className={styles.special_value}>{getString(router.locale, Strings.HONORABLE_MENTIONS)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FestivalPrizes;
