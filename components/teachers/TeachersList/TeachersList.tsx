import styles from './TeachersList.module.scss'
import TeacherType from '../types/TeacherType'
import TeacherItem from './components/TeacherItem'

type Props = {
  teachers: TeacherType[]
  onSelect: (item: TeacherType) => void
}

const TeachersList = ({ teachers, onSelect }: Props) => {
  return (
    <>
      <div className={styles.container}>
        {teachers.map((item) => (
          <TeacherItem key={item.id} item={item} onSelect={onSelect} />
        ))}
      </div>
    </>
  )
}

export default TeachersList
