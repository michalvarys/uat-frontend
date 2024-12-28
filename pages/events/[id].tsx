import Image from 'next/image'
import Head from 'next/head'
import parse from 'html-react-parser'
import axios from 'axios'
import styles from './events.module.scss'

import Container, { ContainerVariant } from 'src/components/common/Container'
import FestivalType from 'src/components/festivals/types/FestivalType'
import { GalleryEventType } from 'src/components/galleries/types/GalleryEventType'
import { REVALIDATE_TIME } from 'src/constants'
import GallerySlice from 'src/components/slices/GallerySlice'
import { useApp } from 'src/components/context/AppContext'
import { useEffect } from 'react'
import { setLocalizationData } from 'src/utils/localizationsUtils'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { localesToParams } from 'src/utils/params'
import { DbImage } from 'src/components/DbImage'
import { getEventList, getEventDetail } from '@/queries/events'

type GalleryEventProps = {
  galleryEvent: GalleryEventType
}

export default function GalleryEvent({ galleryEvent }: GalleryEventProps) {
  const { cover_image, description, gallery } = galleryEvent
  const { setLocalePaths } = useApp()

  useEffect(() => {
    if (galleryEvent?.localizations?.data?.length > 0) {
      setLocalizationData(
        setLocalePaths,
        galleryEvent.localizations.data,
        '/events'
      )
    } else {
      setLocalizationData(setLocalePaths, null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [galleryEvent])

  if (!galleryEvent) {
    return <></>
  }

  return (
    <>
      <Container variant={ContainerVariant.Black}>
        <Head>
          <title>{galleryEvent.title}</title>
        </Head>
        <div className={styles.cover_image}>
          <DbImage
            data={cover_image}
            props={{
              layout: 'fill',
              objectFit: 'cover',
              objectPosition: '50% 30%',
            }}
          />
        </div>
        <div className={styles.container}>
          <div className={styles.title}>
            <h1 className={styles.header}>{galleryEvent.title}</h1>
          </div>
          {description && (
            <div className={styles.description_content}>
              {parse(description)}
            </div>
          )}
        </div>
        <div className={styles.bottom_container}>
          {gallery && <GallerySlice data={gallery} isSmall />}
        </div>
      </Container>
    </>
  )
}

export async function getStaticPaths({ locales }: GetStaticPropsContext) {
  try {
    const galleryEvents = await getEventList(locales)

    return {
      paths: galleryEvents.map((item) => ({
        params: {
          id: item.id.toString(),
        },
      })),
      fallback: 'blocking',
    }
  } catch (e) {
    return {
      paths: [],
      fallback: 'blocking',
    }
  }
}

type Params = {
  id: string
}

export async function getStaticProps({
  locale,
  params,
}: GetStaticPropsContext<Params>): Promise<
  GetStaticPropsResult<GalleryEventProps>
> {
  try {
    const galleryEvent = await getEventDetail(params!.id, locale)

    if (!galleryEvent) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        galleryEvent,
      },

      revalidate: REVALIDATE_TIME,
    }
  } catch (e) {
    return {
      redirect: {
        destination: '/500',
        permanent: false,
      },
      revalidate: REVALIDATE_TIME,
    }
  }
}
