import { ShortTextType } from '../../fields/types/SubjectsType'
import ApplicationsAtUniversityType, {
  ApplicationsSectionType,
} from '../types/ApplicationsAtUniversityType'

import styles from './ApplicationsAtUniversity.module.scss'

type Props = {
  data: ApplicationsAtUniversityType
}

const ApplicationsAtUniversity = ({ data }: Props) => {
  if (!data.sections) {
    return <></>
  }
  return (
    <div className={styles.container}>
      <h1>{data.header}</h1>
      <div className={styles.content}>
        {data.sections.map((section: ApplicationsSectionType) => (
          <div className={styles.sectionContainer} key={section.id}>
            <div className={styles.sectionTitle}>{section.title}</div>
            <div>
              {section.list.map((item: ShortTextType) => (
                <div key={item.id} className={styles.item}>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ApplicationsAtUniversity
