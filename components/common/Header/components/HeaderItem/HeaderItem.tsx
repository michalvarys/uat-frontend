import classNames from 'classnames'
import { MouseEventHandler } from 'react'
import styles from './HeaderItem.module.scss'

type Props = {
  onOpen: MouseEventHandler
  title: string
  currentSection: number
  idx: number
}

const HeaderItem = ({ onOpen, title = '', currentSection, idx }: Props) => {
  return (
    <div
      className={classNames({
        [styles.container]: true,
        [styles.container_open_yellow]: currentSection === idx && idx === 0,
        [styles.container_open_green]: currentSection === idx && idx === 1,
        [styles.container_open_orange]: currentSection === idx && idx === 2,
        [styles.container_open_white]: currentSection === idx && idx === 3,
      })}
      onMouseEnter={onOpen}
    >
      <div
        className={classNames({
          [styles.title]: true,
          [styles.title_open]: currentSection === idx,
        })}
      >
        {title.toUpperCase()}
      </div>
    </div>
  )
}

export default HeaderItem
