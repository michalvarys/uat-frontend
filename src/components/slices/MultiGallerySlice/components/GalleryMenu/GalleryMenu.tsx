import styles from './GalleryMenu.module.scss'

type Props = {
  current: number
  names: string[]
  onChange: (value: number) => void
}

type ItemProps = {
  title: string
  isMarked: boolean
  onChange: () => void
}
const Item = ({ title, isMarked, onChange }: ItemProps) => (
  <div className={styles.item_container} onClick={() => onChange()}>
    <div className={styles.title}>{title}</div>
    <div
      className={styles.indicator}
      style={isMarked ? { opacity: 1 } : { opacity: 0 }}
    />
  </div>
)

const GalleryMenu = ({ current, names, onChange }: Props) => {
  return (
    <div className={styles.menu_container}>
      {names.map((item: string, idx: number) => {
        return (
          <Item
            key={item}
            title={item}
            isMarked={current === idx}
            onChange={() => onChange(idx)}
          />
        )
      })}
    </div>
  )
}

export default GalleryMenu
