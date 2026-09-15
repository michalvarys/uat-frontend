import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getEventList, getEventDetail } from '@/queries/events'
import { resolveSeo } from 'src/utils/seo'
import { LOCALES } from 'src/i18n/config'

import EventDetail from './EventDetail'

export const revalidate = 10
export const dynamicParams = true

type Props = {
  params: Promise<{ lang: string; id: string }>
}

export async function generateStaticParams() {
  try {
    const events = await getEventList(LOCALES as unknown as string[])
    return events.flatMap((item) =>
      LOCALES.map((lang) => ({ lang, id: item.id.toString() }))
    )
  } catch {
    return []
  }
}

async function getData(id: string, lang: string) {
  try {
    return await getEventDetail(id, lang)
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params
  const event = await getData(id, lang)

  if (!event) {
    return {}
  }

  const seo = resolveSeo({
    seo: (event as any).seo,
    title: event.title,
    description: (event as any).description,
    image: event.cover_image,
    path: `/events/${id}`,
    locale: lang,
  })

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: seo.canonical },
    robots: seo.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.canonical,
      type: 'article',
      images: seo.image ? [seo.image] : undefined,
    },
  }
}

export default async function EventPage({ params }: Props) {
  const { lang, id } = await params
  const event = await getData(id, lang)

  if (!event) {
    notFound()
  }

  return <EventDetail event={event} />
}
