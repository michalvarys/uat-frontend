import classNames from 'classnames'
import Link from 'next/link'

import styles from './BorderedButton.module.scss'

type Props = {
  title: string
  url: string
  isDark?: boolean
}

const BorderedButton = ({ title, url, isDark = false }: Props) => (
  <Link
    href={url}
    className={classNames({
      [styles.container]: true,
      [styles.container_dark]: isDark,
    })}
  >
    <span
      className={classNames({
        [styles.title]: true,
        [styles.title_dark]: isDark,
      })}
    >
      {title}
    </span>
  </Link>
)

export default BorderedButton
