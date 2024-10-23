import Image from 'next/image'
import { useRouter } from 'next/router'
import parse from 'html-react-parser'

import styles from './UATGalleriesSlice.module.scss'
import UATGalleryType from '../types/UATGalleryType'
import { GalleryEventType } from '../../galleries/types/GalleryEventType'

import ArrowRightIcon from 'public/icons/common/arrow_right.svg'
import { DbImage } from 'src/components/DbImage'

type ItemProps = {
  item: UATGalleryType
}
const UATGalleryItem = ({ item }: ItemProps) => {
  return (
    <div className={styles.item_container}>
      <div className={styles.top_container}>
        <div className={styles.thumbnail}>
          <DbImage
            data={item.image_424x488}
            props={(image) => ({
              width: image.width,
              height: image.height,
              objectFit: 'cover',
              objectPosition: 'center center',
            })}
          />
        </div>
        <div className={styles.text_container}>
          <span className={styles.name}>{item.name}</span>
          <span className={styles.address}>{item.address}</span>
        </div>
      </div>
    </div>
  )
}

type GalleryEventProps = {
  event: GalleryEventType
  onSelect: Function
}

const GalleryEventItem = ({ event, onSelect }: GalleryEventProps) => {
  return (
    <div className={styles.item_container} onClick={() => onSelect(event)}>
      <div className={styles.content}>
        <span className={styles.title}>{event.title}</span>
        <span className={styles.sneak_peak}>{parse(event.description)}</span>
      </div>
      <div className={styles.arrow}>
        <Image src={ArrowRightIcon} alt={'arrow'} />
      </div>
    </div>
  )
}

type Props = {
  galleries: UATGalleryType[]
  events?: GalleryEventType[]
}

const UATGalleriesSlice = ({ galleries, events }: Props) => {
  const router = useRouter()

  const onEventSelect = (event: GalleryEventType) => {
    router.push(`/events/${event.id}`)
  }
  return (
    <div className={styles.container}>
      <div className={styles.galleries}>
        {galleries?.filter(Boolean).map((item) => (
          <UATGalleryItem key={item.id} item={item} />
        ))}
      </div>

      <div className={styles.events}>
        {events?.filter(Boolean).map((item) => (
          <GalleryEventItem
            key={item.id}
            event={item}
            onSelect={onEventSelect}
          />
        ))}
      </div>
    </div>
  )
}

export default UATGalleriesSlice
