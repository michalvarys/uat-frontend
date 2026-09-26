import Image from 'next/image'
import Link from 'next/link'

import styles from './DocumentItem.module.scss'

import ArrowRightIcon from 'public/icons/common/arrow_right.svg'
import DocumentType from '../../../types/DocumentType'
import { transformLink } from 'src/utils/link'
import { formatDate } from 'src/utils/date'

type Props = {
  document: DocumentType
  onSelect: (item: DocumentType) => void
}

const DocumentItem = ({ document, onSelect }: Props) => {
  return (
    <Link
      href={transformLink(document.url)}
      className={styles.container}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className={styles.content}>
        <span className={styles.title}>{`${document.name}`}</span>
        <span className={styles.date}>
          {formatDate(document.updated_at, 'YYYY-MM-DD HH:mm')}
        </span>
        <div className={styles.arrow}>
          <Image src={ArrowRightIcon} alt={'arrow'} />
        </div>
      </div>
    </Link>
  )
}

export default DocumentItem
