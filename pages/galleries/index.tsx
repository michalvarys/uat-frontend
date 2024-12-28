import 'moment/locale/sk'
import Head from 'next/head'
import { useRouter } from 'next/router'
import styles from './galleries.module.scss'

import { getString, Strings } from 'src/locales'
import Container, { ContainerVariant } from 'src/components/common/Container'
import GalleriesOverviewType from 'src/components/galleries/types/GalleriesOverviewType'
import UATGalleriesSlice from 'src/components/slices/UATGalleriesSlice'
import TextWithImageSlice from 'src/components/slices/TextWithImageSlice'
import EventsSlice from 'src/components/slices/EventsSlice'
import { useApp } from 'src/components/context/AppContext'
import { useEffect } from 'react'
import { setLocalizationData } from 'src/utils/localizationsUtils'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { chakra } from '@chakra-ui/react'
import { getGalleriesData } from 'src/queries/galleries'

type PageProps = {
  data: GalleriesOverviewType
}

export default function GalleriesOverview({ data }: PageProps) {
  const router = useRouter()
  const { setLocalePaths } = useApp()

  useEffect(() => {
    setLocalizationData(setLocalePaths, null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const firstEvent =
    data.galleryEvents && data.galleryEvents.length > 0
      ? data.galleryEvents[0]
      : null

  return (
    <chakra.div w="full" className={styles.container}>
      <Head>
        <title>{data.title}</title>
      </Head>

      <Container variant={ContainerVariant.Black}>
        <div className={styles.top_container}>
          <div className={styles.title}>{data.title}</div>
          <div className={styles.description}>{data.description}</div>
        </div>
      </Container>

      <Container variant={ContainerVariant.White} isHigh>
        <div className={styles.bottom_container}>
          {data.galleries_uat ? (
            <UATGalleriesSlice galleries={data.galleries_uat} />
          ) : (
            <></>
          )}
        </div>
      </Container>

      <Container variant={ContainerVariant.White}>
        {firstEvent ? (
          <TextWithImageSlice
            extraTopSpace={-357}
            extraTextTopSpace={-300}
            data={{
              title: firstEvent.title,
              subtitle: firstEvent.subtitle,
              content: firstEvent.description,
              left_side_image: false,
              image: firstEvent.image,
              link: {
                __component: '',
                id: 0,
                title:
                  getString(router.locale, Strings.EXHIBITION_DETAIL) || '',
                path: `/events/${firstEvent.id}`,
              },
            }}
          />
        ) : (
          <></>
        )}
        <EventsSlice events={data.galleryEvents} />
      </Container>
    </chakra.div>
  )
}

export async function getServerSideProps({
  locale,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<unknown>> {
  try {
    const data = await getGalleriesData(locale)

    return {
      props: {
        data,
      },
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e.message)
    return {
      props: {},
    }
  }
}
