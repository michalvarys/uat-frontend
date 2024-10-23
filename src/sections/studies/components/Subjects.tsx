import Image from 'next/image'
import parse from 'html-react-parser'

import styles from './Subjects.module.scss'

import { transformLink } from 'src/utils/link'
import { SubjectsType } from 'src/types/fieldsOfStudy'
import { getAttributes } from 'src/utils/data'

type Props = {
  subjects: SubjectsType
}

export const Subjects = ({ subjects }: Props) => {
  const image = getAttributes(subjects?.sponsor?.image)

  const renderSponsor = () => (
    <div className={styles.sponsor_container}>
      {image && (
        <Image
          src={transformLink(image.url)}
          alt=""
          width={image.width}
          height={image.height}
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
