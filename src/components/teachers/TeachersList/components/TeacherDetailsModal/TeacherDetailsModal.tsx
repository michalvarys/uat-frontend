import Image from 'next/image'
import parse from 'html-react-parser'
import styles from './TeacherDetailsModal.module.scss'

import Modal from '../../../../common/Modal'
import TeacherType from '../../../types/TeacherType'
import { transformLink } from 'src/utils/link'

type Props = {
  data: TeacherType
  isOpen: boolean
  onClose: () => void
}

const TeacherDetailsModal = ({ data, isOpen, onClose }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={() => onClose()}>
      <div className={styles.container}>
        <div className={styles.left_container}>
          {data.photo && (
            <Image
              alt={data.photo.alternativeText}
              src={transformLink(data.photo.url)}
              width={data.photo.width}
              height={(data.photo.height * 340) / data.photo.width}
              layout={'responsive'}
              objectFit={'cover'}
              objectPosition={'center 0%'}
            />
          )}
        </div>
        <div className={styles.right_container}>
          <span
            className={styles.name}
          >{`${data.title} ${data.firstname} ${data.surname}`}</span>
          {data.extra_role && (
            <span className={styles.role}>{data.extra_role}</span>
          )}
          <div className={styles.bio}>{parse(data.bio)}</div>
        </div>
      </div>
    </Modal>
  )
}

export default TeacherDetailsModal
