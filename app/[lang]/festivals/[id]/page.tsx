import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getFestivalList, getFestivalDetail } from '@/queries/festivals'
import { resolveSeo } from 'src/utils/seo'
import { LOCALES } from 'src/i18n/config'

import FestivalDetail from './FestivalDetail'

export const revalidate = 10
export const dynamicParams = true

type Props = {
  params: Promise<{ lang: string; id: string }>
}

export async function generateStaticParams() {
  try {
    const festivals = await getFestivalList(LOCALES as unknown as string[])
    return festivals.flatMap((item) =>
      LOCALES.map((lang) => ({ lang, id: item.id.toString() }))
    )
  } catch {
    return []
  }
}

async function getData(id: string, lang: string) {
  try {
    return await getFestivalDetail(id, lang)
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params
  const festival = await getData(id, lang)

  if (!festival) {
    return {}
  }

  const seo = resolveSeo({
    seo: (festival as any).seo,
    title: festival.title,
    description: (festival as any).description,
    image: festival.cover_image,
    path: `/festivals/${id}`,
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

export default async function FestivalPage({ params }: Props) {
  const { lang, id } = await params
  const festival = await getData(id, lang)

  if (!festival) {
    notFound()
  }

  return <FestivalDetail festival={festival} />
}
