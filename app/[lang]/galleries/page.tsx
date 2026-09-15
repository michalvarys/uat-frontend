import type { Metadata } from 'next'

import { getString, Strings } from 'src/locales'
import Container, { ContainerVariant } from 'src/components/common/Container'
import UATGalleriesSlice from 'src/components/slices/UATGalleriesSlice'
import TextWithImageSlice from 'src/components/slices/TextWithImageSlice'
import EventsSlice from 'src/components/slices/EventsSlice'
import { getGalleriesData } from 'src/queries/galleries'
import { resolveSeo } from 'src/utils/seo'
import { localePath } from 'src/i18n/config'

import styles from './galleries.module.scss'

export const revalidate = 10

type Props = {
  params: Promise<{ lang: string }>
}

async function getData(lang: string) {
  try {
    return await getGalleriesData(lang)
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const data = await getData(lang)

  const seo = resolveSeo({
    seo: data?.seo,
    title: data?.title,
    description: data?.description,
    path: '/galleries',
    locale: lang,
  })

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: seo.canonical },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.canonical,
      images: seo.image ? [seo.image] : undefined,
    },
  }
}

export default async function GalleriesPage({ params }: Props) {
  const { lang } = await params
  const data = await getData(lang)

  if (!data) {
    return null
  }

  const firstEvent = data.galleryEvents?.length ? data.galleryEvents[0] : null

  return (
    <div style={{ width: '100%' }} className={styles.container}>
      <Container variant={ContainerVariant.Black}>
        <div className={styles.top_container}>
          {/* Dřív <div> — nadpis stránky patří do h1, ať ho vyhledávače
              rozpoznají jako hlavní téma. */}
          <h1 className={styles.title}>{data.title}</h1>
          <div className={styles.description}>{data.description}</div>
        </div>
      </Container>

      <Container variant={ContainerVariant.White} isHigh>
        <div className={styles.bottom_container}>
          {data.galleries_uat ? (
            <UATGalleriesSlice galleries={data.galleries_uat} />
          ) : null}
        </div>
      </Container>

      <Container variant={ContainerVariant.White}>
        {firstEvent ? (
          <TextWithImageSlice
            extraTopSpace={-157}
            extraTextTopSpace={-150}
            data={{
              title: firstEvent.title,
              subtitle: firstEvent.subtitle,
              content: firstEvent.description,
              left_side_image: false,
              image: firstEvent.image,
              link: {
                __component: '',
                id: 0,
                title: getString(lang, Strings.EXHIBITION_DETAIL) || '',
                path: localePath(`/events/${firstEvent.id}`, lang),
              },
            }}
          />
        ) : null}
        <EventsSlice events={data.galleryEvents} />
      </Container>
    </div>
  )
}
