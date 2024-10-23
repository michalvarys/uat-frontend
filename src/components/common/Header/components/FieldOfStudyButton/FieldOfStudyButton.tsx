import Image from 'next/image'
import { useRouter } from 'next/router'
import { FieldOfStudyType } from 'src/types/fieldsOfStudy'

import { transformLink } from 'src/utils/link'

import styles from './FieldOfStudyButton.module.scss'
import { DbImage } from 'src/components/DbImage'

type Props = {
  study: FieldOfStudyType
}

const FieldOfStudyButton = ({ study }: Props) => {
  const router = useRouter()
  const onSelect = () => {
    router.push(`/studies/${study.id}`)
  }

  return (
    <div className={styles.container} onClick={onSelect}>
      <DbImage
        data={study.icon_svg}
        props={(image) => ({
          height: 72,
          width: 72,
          objectFit: 'contain',
          objectPosition: '0% 50%',
        })}
      />
      <span className={styles.title}>{study.name}</span>
    </div>
  )
}

export default FieldOfStudyButton
