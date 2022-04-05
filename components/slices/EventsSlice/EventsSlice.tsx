import styles from './EventsSlice.module.scss';

import { getString, Strings } from '../../../locales';
import { useRouter } from 'next/router';
import { useState } from 'react';
import PaginationSwitcher from '../../common/PaginationSwitcher';
import { PaginationSwitcherVariant } from '../../common/PaginationSwitcher/PaginationSwitcher';
import { GalleryEventType } from '../../galleries/types/GalleryEventType';
import EventsList from '../../galleries/EventsList';

type Props = {
  events: Array<GalleryEventType>,
}

const EventsSlice = ({ events }: Props) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const pagesCount = Math.ceil(events.length / 6);


  const onSelectProject = (event: GalleryEventType) => {
    router.push(`/events/${event.id}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>{getString(router.locale, Strings.PREVIOUS_EXHIBITIONS)}</h1>
      <PaginationSwitcher
        onSelect={setCurrentPage}
        pages={Array.from(Array(pagesCount).keys()).map((item) => (item + 1).toString())}
        current={currentPage}
        variant={PaginationSwitcherVariant.WhiteBackground}
      />
      <EventsList events={events.slice(currentPage * 6, (currentPage + 1) *6)} onSelect={onSelectProject}/>
    </div>
  );
};

export default EventsSlice;
