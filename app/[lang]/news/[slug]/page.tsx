import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getNewsDetail, getNewsByLocales } from '@/queries/news'
import NewsType from 'src/components/news/types/NewsType'
import { resolveSeo } from 'src/utils/seo'
import { LOCALES } from 'src/i18n/config'

import NewsDetail from './NewsDetail'

export const revalidate = 10
export const dynamicParams = true

type Props = {
  params: Promise<{ lang: string; slug: string }>
}

export async function generateStaticParams() {
  try {
    const news = await getNewsByLocales(LOCALES as unknown as string[])

    // Novinka bez slugu je rozepsaný záznam v CMS; předgenerovat ji nelze.
    return news
      .filter(
        (item: NewsType) => typeof item.slug === 'string' && item.slug !== ''
      )
      .flatMap((item: NewsType) =>
        LOCALES.map((lang) => ({ lang, slug: item.slug }))
      )
  } catch {
    return []
  }
}

async function getData(slug: string, lang: string) {
  try {
    return await getNewsDetail(slug, lang)
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params
  const news = await getData(slug, lang)

  if (!news) {
    return {}
  }

  const seo = resolveSeo({
    seo: (news as any).seo,
    title: news.title,
    sections: news.sections,
    path: `/news/${slug}`,
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
      publishedTime: news.date,
      images: seo.image ? [seo.image] : undefined,
    },
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const { lang, slug } = await params
  const news = await getData(slug, lang)

  // Novinka nepřeložená do daného jazyka nesmí vrátit prázdnou stránku
  // se stavem 200 — vyhledávače by ji zaindexovaly jako plnohodnotnou.
  if (!news) {
    notFound()
  }

  return <NewsDetail news={news} />
}
