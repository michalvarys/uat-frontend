import Image from 'next/image'
import parse from 'html-react-parser'
import styles from './TeacherDetailsModal.module.scss'

import Modal from '../../../../common/Modal'
import TeacherType from '../../../types/TeacherType'
import { transformLink } from 'src/utils/link'
import { getAttributes } from 'src/utils/data'
import { DbImage } from 'src/components/DbImage'
import { layout } from '@chakra-ui/react'

type Props = {
  data: TeacherType
  isOpen: boolean
  onClose: () => void
}

const TeacherDetailsModal = ({ data, isOpen, onClose }: Props) => {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <Modal isOpen={isOpen} onClose={() => onClose()}>
      <div className={styles.container}>
        <div className={styles.left_container}>
          <DbImage
            data={data.photo_340x609}
            props={(image) => ({
              height: (image.height * 340) / image.width,
              layout: 'responsive',
              objectFit: 'cover',
              objectPosition: 'center 0%',
            })}
          />
          {/* {data.photo_340x609 && (
            <Image
              alt={data.photo_340x609.alternativeText}
              src={transformLink(data.photo_340x609.url)}
              width={data.photo_340x609.width}
              height={
                (data.photo_340x609.height * 340) / data.photo_340x609.width
              }
              layout={'responsive'}
              objectFit={'cover'}
              objectPosition={'center 0%'}
            />
          )} */}
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
