import Image from 'next/image'
import { useRouter } from 'next/router'

import styles from './FieldOfStudyCarusel.module.scss'

import { transformLink } from 'src/utils/link'

import ArrowIcon from 'public/icons/common/arrow_right.svg'
import { FieldOfStudyType } from 'src/types/fieldsOfStudy'
import { getAttributes } from 'src/utils/data'

type Props = {
  fields: FieldOfStudyType[]
}

type FieldItemPros = {
  field: FieldOfStudyType
}

const FieldItem = ({ field }: FieldItemPros) => {
  const img = getAttributes(field.icon_svg)
  const router = useRouter()

  const onSelect = () => {
    router.push(`/studies/${field.id}`)
  }

  return (
    <div onClick={onSelect} className={styles.item}>
      <div className={styles.content}>
        <div className={styles.image}>
          {img && (
            <Image
              src={transformLink(img.url)}
              width={90}
              height={90}
              alt="icon"
            />
          )}
        </div>
        <div className={styles.title}>{field.name}</div>
      </div>
      <div className={styles.arrow}>
        <Image src={ArrowIcon} alt="arrow" />
      </div>
    </div>
  )
}

const FieldOfStudyCarusel = ({ fields }: Props) => {
  return (
    <div className={styles.container}>
      {fields.map((item) => item && <FieldItem key={item.id} field={item} />)}
    </div>
  )
}

export default FieldOfStudyCarusel
