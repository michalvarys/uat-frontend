import classNames from 'classnames'
import styles from './YearSwitcher.module.scss'

export enum YearSwitcherVariant {
  WhiteBackground,
  OrangeBackground,
}

type Props = {
  current: number
  // eslint-disable-next-line @typescript-eslint/ban-types
  onSelect: Function
  years: string[]
  variant: number
}

const YearSwitcher = ({ current, onSelect, years, variant }: Props) => (
  <div className={styles.year_switcher_container}>
    {years?.map((item: string, index: number) => (
      <div
        className={styles.button}
        key={`year-button-${item}-${index}`}
        onClick={() => onSelect(index)}
      >
        <div className={styles.title}>{item}</div>
        {current === index ? (
          <div
            className={classNames({
              [styles.indicator]: true,
              [styles.indicator_white]:
                variant === YearSwitcherVariant.OrangeBackground,
            })}
          />
        ) : null}
      </div>
    ))}
  </div>
)

export default YearSwitcher
