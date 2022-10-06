import { getString, Strings } from '../../../locales'
import TeacherItem from '../TeachersList/components/TeacherItem'
import TeacherType from '../types/TeacherType'
import { Scrollbars } from 'react-custom-scrollbars'

import styles from './TeachersCarusel.module.scss'
import { useRouter } from 'next/router'

type Props = {
  isTitle: boolean
  teachers: TeacherType[]
}

const TeachersCarusel = ({ isTitle = false, teachers }: Props) => {
  const router = useRouter()

  if (!teachers || teachers.length === 0) {
    return null
  }

  const onSelectTeacher = (id: number) => {
    router.push(`/teachers?id=${id}`)
  }

  return (
    <>
      {isTitle ? (
        <div className={styles.title}>
          {getString(router.locale, Strings.WHO_IS_TEACHING)}
        </div>
      ) : null}
      <div className={styles.container}>
        <Scrollbars autoHide style={{ height: 612 }}>
          <div className={styles.inner_container}>
            {teachers.map(
              (item: TeacherType) =>
                item && (
                  <TeacherItem
                    // isFixed
                    key={item.id}
                    item={item}
                    onSelect={() => onSelectTeacher(item.id)}
                  />
                )
            )}
          </div>
        </Scrollbars>
      </div>
    </>
  )
}

export default TeachersCarusel
