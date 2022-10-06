import Image from 'next/image'
import Head from 'next/head'
import parse from 'html-react-parser'
import axios from 'axios'
import styles from './events.module.scss'

import Container, { ContainerVariant } from '../../components/common/Container'
import FestivalType from '../../components/festivals/types/FestivalType'
import { GalleryEventType } from '../../components/galleries/types/GalleryEventType'
import { REVALIDATE_TIME } from '../../consts/app.consts'
import { transformLink } from '../../utils/transformLink'
import GallerySlice from '../../components/slices/GallerySlice'
import { useApp } from '../../components/context/AppContext'
import { useEffect } from 'react'
import { setLocalizationData } from '../../utils/localizationsUtils'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { localesToParams } from '../../utils/params'

type GalleryEventProps = {
  galleryEvent: GalleryEventType
}

export default function GalleryEvent({ galleryEvent }: GalleryEventProps) {
  const { cover_image, description, gallery } = galleryEvent
  const { setLocalePaths } = useApp()

  useEffect(() => {
    if (galleryEvent && galleryEvent.localizations.length > 0) {
      setLocalizationData(setLocalePaths, galleryEvent.localizations, '/events')
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
        ) : (
          <></>
        )}
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
  const params = localesToParams(locales)
  const url = `/cms/gallery-events?${params}`

  try {
    const { data: galleryEvents } = await axios.get<FestivalType[]>(url)

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
  const url = `/gallery-events/${params!.id}?_locale=${locale}`

  try {
    const { data: galleryEvent } = await axios(url)

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
