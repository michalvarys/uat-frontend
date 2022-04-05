import { GalleryEventType } from '../types/GalleryEventType';
import EventItem from './components/EventItem';


import styles from './EventsList.module.scss';


type Props = {
  events: Array<GalleryEventType>,
  onSelect: (item: GalleryEventType) => void,
}

const EventsList = ({ events = [], onSelect }: Props) => {
  return (
    <div className={styles.container}>
      {events.map((item: GalleryEventType) => (
        <EventItem event={item} key={item.id} onSelect={onSelect} />
      ))}
    </div>
  );
};

export default EventsList;
