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
        {teachers
          .sort((a, b) => {
            const prioA = a.sort
            const prioB = b.sort

            if (!prioA && prioB) {
              return 1
            }

            if (prioA && !prioB) {
              return -1
            }

            if ((!prioA && !prioB) || prioA === prioB) {
              return a.surname.localeCompare(b.surname)
            }

            return prioA < prioB ? -1 : 1
          })
          .map((item) => (
            <TeacherItem key={item.id} item={item} onSelect={onSelect} />
          ))}
      </div>
    </>
  )
}

export default TeachersList
