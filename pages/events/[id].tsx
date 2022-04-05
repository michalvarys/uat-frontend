import Image from 'next/image';
import Head from 'next/head';
import parse from 'html-react-parser';
import axios from 'axios';
import styles from './events.module.scss';

import Container, { ContainerVariant } from '../../components/common/Container';
import FestivalType from '../../components/festivals/types/FestivalType';
import { GalleryEventType } from '../../components/galleries/types/GalleryEventType';
import { REVALIDATE_TIME } from '../../consts/app.consts';
import { transformLink } from '../../utils/transformLink';
import GallerySlice from '../../components/slices/GallerySlice';
import { useApp } from '../../components/context/AppContext';
import { useEffect } from 'react';
import { setLocalizationData } from '../../utils/localizationsUtils';

type GalleryEventProps = {
  galleryEvent: GalleryEventType,
};

export default function GalleryEvent({ galleryEvent }: GalleryEventProps) {
  const { cover_image, description, gallery } = galleryEvent;
  const { setLocalePaths } = useApp();

  useEffect(() => {
    if (galleryEvent && galleryEvent.localizations.length > 0) {
      setLocalizationData(setLocalePaths, galleryEvent.localizations, '/events');
    } else {
      setLocalizationData(setLocalePaths, null); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [galleryEvent]);

  if (!galleryEvent) {
    return <></>
  }
  return (
    <>
      <Container variant={ContainerVariant.Black}>
        <Head>
          <title>{galleryEvent.title}</title>
        </Head>
        {cover_image ? (
            <div className={styles.cover_image}>
              <Image
                src={transformLink(cover_image.url)}
                alt={cover_image.alternativeText}
                layout={'fill'}
                objectFit={'cover'}
                objectPosition={'50% 30%'}
              />
            </div>
          ) : <></>}
        <div className={styles.container}>
          <div className={styles.title}>
            <h1 className={styles.header}>{galleryEvent.title}</h1>
          </div>
          {description && (
            <div className={styles.description_content}>{parse(description)}</div>
          )}
        </div>
        <div className={styles.bottom_container}>
          {gallery && (
            <GallerySlice data={gallery} isSmall />
          )}
        </div>
      </Container>
    </>
  )
};

type StaticPathsPropsType = {
  locales: Array<string>,
};

export async function getStaticPaths({ locales }: StaticPathsPropsType) {
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  const port = process.env.NEXT_PUBLIC_API_PORT;
  const url = `${baseURL}:${port}/gallery-events?${locales.map((locale: string, idx: number) => {
    return `_locale=${locale}${idx < locales.length - 1 ? '&' : ''}`;
  }).join('')}`;
  
  let res 
  try {
    res = await axios(url);
  } catch (e) {
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
  
  const galleryEvents = res.data;

  return {
    paths: galleryEvents.map((item: FestivalType) => (
      { params: { id: item.id.toString() } }
    )),
    fallback: 'blocking',
  };
};

type StaticPropsType = {
  locale: string,
  params: any,
};

export async function getStaticProps({ locale, params }: StaticPropsType) {
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  const port = process.env.NEXT_PUBLIC_API_PORT;
  const url = `${baseURL}:${port}/gallery-events/${params.id}?_locale=${locale}`;

  let res 
  try {
    res = await axios(url);
  } catch (e) {
    return {
      props: {},
      revalidate: REVALIDATE_TIME,
    };
  }
  const galleryEvent = res.data;
  return {
    props: {
      galleryEvent,
    },
    revalidate: REVALIDATE_TIME,
  }
};
