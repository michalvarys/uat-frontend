import parse from 'html-react-parser'
import Image from 'next/image'
import moment from 'moment'

import styles from './EventItem.module.scss'

import ArrowRightIcon from 'public/icons/common/arrow_right.svg'
import { GalleryEventType } from '../../../types/GalleryEventType'
import { transformLink } from 'src/utils/link'
import { DbImage } from 'src/components/DbImage'

type Props = {
  event: GalleryEventType
  onSelect: (item: GalleryEventType) => void
}

const EUProjectItem = ({ event, onSelect }: Props) => {
  return (
    <div className={styles.container} onClick={() => onSelect(event)}>
      <div className={styles.image_container}>
        <DbImage
          data={event.image}
          props={{
            layout: 'fill',
            objectFit: 'cover',
            objectPosition: '50% 30%',
          }}
        />
      </div>
      <div className={styles.content}>
        <span className={styles.date}>
          {moment(event.date).format('DD MMM YYYY')}
        </span>
        <span className={styles.title}>{event.title}</span>
        <span className={styles.sneak_peak}>{parse(event.description)}</span>
        <Image src={ArrowRightIcon} alt={'arrow'} />
      </div>
    </div>
  )
}

export default EUProjectItem
