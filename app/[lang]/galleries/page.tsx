import type { Metadata } from 'next'
import { isBuildPhase, skipDuringBuild } from 'src/queries/buildTime'
import { notFound } from 'next/navigation'

import { getString, Strings } from 'src/locales'
import Container, { ContainerVariant } from 'src/components/common/Container'
import { CmsContent } from 'src/components/CmsContent'
import UATGalleriesSlice from 'src/components/slices/UATGalleriesSlice'
import TextWithImageSlice from 'src/components/slices/TextWithImageSlice'
import EventsSlice from 'src/components/slices/EventsSlice'
import { getGalleriesData } from 'src/queries/galleries'
import { resolveSeo } from 'src/utils/seo'
import { localePath } from 'src/i18n/config'

import styles from './galleries.module.scss'

export const revalidate = 300

type Props = {
  params: Promise<{ lang: string }>
}

/**
 * Stránka galerií v CMS vždy existuje, takže selhání dotazu znamená výpadek,
 * ne chybějící obsah. Chybu proto nepolykáme: kdyby se vrátilo null,
 * vykreslila by se prázdná stránka se stavem 200 — a ta by se navíc
 * na `revalidate` sekund uložila do cache, takže by prázdná zůstala
 * i pro další návštěvníky. Výjimka místo toho spustí error.tsx
 * a Next se o obsah pokusí znovu při dalším požadavku.
 */
async function getData(lang: string) {
  // Při buildu v CI žádné CMS neběží. Stránka se tehdy nepředgeneruje
  // a vykreslí se až při prvním požadavku, kdy už CMS dostupné je.
  // Za běhu se chyba naopak propustí dál — viz skipDuringBuild.
  return skipDuringBuild(() => getGalleriesData(lang), null)
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

  // Za běhu sem dojdeme jen když CMS obsah opravdu nemá — chyby už
  // getData nepolyká. Prázdná stránka se stavem 200 by se zaindexovala
  // jako plnohodnotná, proto 404.
  //
  // Při buildu je null očekávaný stav (CMS v CI neběží). Stránka se
  // tehdy předgeneruje prázdná a `revalidate` ji naplní při prvním
  // požadavku; 404 by se do statického výstupu zapekla natrvalo.
  if (!data) {
    if (isBuildPhase()) {
      return null
    }

    notFound()
  }

  const firstEvent = data.galleryEvents?.length ? data.galleryEvents[0] : null

  return (
    <div style={{ width: '100%' }} className={styles.container}>
      <Container variant={ContainerVariant.Black}>
        <div className={styles.top_container}>
          {/* Dřív <div> — nadpis stránky patří do h1, ať ho vyhledávače
              rozpoznají jako hlavní téma. */}
          <h1 className={styles.title}>{data.title}</h1>
          <CmsContent className={styles.description} data={data.description} />
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
