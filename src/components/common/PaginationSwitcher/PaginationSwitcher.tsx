import classNames from 'classnames'
import styles from './PaginationSwitcher.module.scss'

export enum PaginationSwitcherVariant {
  WhiteBackground,
  OrangeBackground,
}

type Props = {
  current: number
  onSelect: Function
  pages: string[]
  variant: number
}

const PaginationSwitcher = ({ current, onSelect, pages, variant }: Props) => (
  <div className={styles.year_switcher_container}>
    {pages &&
      pages.map((item: string, index: number) => (
        <div
          className={styles.button}
          key={`year-button-${index}`}
          onClick={() => onSelect(index)}
        >
          <div className={styles.title}>{item}</div>
          {current === index ? (
            <div
              className={classNames({
                [styles.indicator]: true,
                [styles.indicator_white]:
                  variant === PaginationSwitcherVariant.OrangeBackground,
              })}
            />
          ) : null}
        </div>
      ))}
  </div>
)

export default PaginationSwitcher
