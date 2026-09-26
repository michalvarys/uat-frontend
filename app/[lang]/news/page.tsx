import { Suspense } from 'react'
import type { Metadata } from 'next'

import { getNewsByYear } from '@/queries/news'
import { getString, Strings } from 'src/locales'
import { resolveSeo } from 'src/utils/seo'

import NewsListView from './NewsListView'

type Props = {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ year?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const seo = resolveSeo({
    title: getString(lang, Strings.NEWS),
    path: '/news',
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

export default async function NewsPage({ params, searchParams }: Props) {
  const { lang } = await params
  const query = await searchParams

  // Přehled zůstává dynamický, protože ročník se vybírá přes ?year=.
  // Chybu záměrně nepolykáme: prázdný seznam novinek vypadá jako
  // „žádné novinky nejsou", ačkoli jde o výpadek CMS. Výjimka spustí
  // error.tsx a při dalším požadavku se data načtou znovu.
  const data = await getNewsByYear(query, lang)

  // NewsListView čte ?year= přes useSearchParams — viz Suspense výš.
  return (
    <Suspense fallback={null}>
      <NewsListView
        news={data.news}
        years={data.years}
        fetchedYear={data.year}
        lang={lang}
      />
    </Suspense>
  )
}
