import Image from 'next/image'
import parse from 'html-react-parser'

import styles from './Subjects.module.scss'

import { transformLink } from 'src/utils/link'
import { SubjectsType } from 'src/types/fieldsOfStudy'

type Props = {
  subjects: SubjectsType
}

export const Subjects = ({ subjects }: Props) => {
  const renderSponsor = () => (
    <div className={styles.sponsor_container}>
      {subjects.sponsor && subjects.sponsor.image && (
        <Image
          src={transformLink(subjects.sponsor.image.url)}
          alt=""
          width={subjects.sponsor.image.width}
          height={subjects.sponsor.image.height}
        />
      )}
      <div className={styles.sponsor_text}>{parse(subjects.sponsor.text)}</div>
    </div>
  )

  const renderSections = () => {
    return subjects.sections.map((item) => (
      <div
        className={styles.subjects_section_contianer}
        key={`subject-section-${item.id}`}
      >
        <div className={styles.subjects_header}>{item.title}</div>
        {item.list.map((subject) => (
          <div className={styles.subject} key={`subject-text-${subject.id}`}>
            {subject.text}
          </div>
        ))}
      </div>
    ))
  }

  return (
    <div className={styles.container}>
      <h2>{subjects.header}</h2>
      <div className={styles.subjects_container}>{renderSections()}</div>
      {renderSponsor()}
    </div>
  )
}
