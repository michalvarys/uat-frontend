import type { Metadata } from 'next'
import { findOrNull } from 'src/queries/errors'
import { notFound } from 'next/navigation'

import { StudiesSection } from 'src/sections/studies/StudiesSection'
import { getStudyData, getStudyList } from 'src/queries/studies'
import { resolveSeo } from 'src/utils/seo'
import { LOCALES } from 'src/i18n/config'

export const revalidate = 10
export const dynamicParams = true

type Props = {
  params: Promise<{ lang: string; id: string }>
}

export async function generateStaticParams() {
  try {
    const studies = await getStudyList(LOCALES as unknown as string[])
    return studies.flatMap((item) =>
      LOCALES.map((lang) => ({ lang, id: item.id.toString() }))
    )
  } catch {
    return []
  }
}

async function getData(id: string, lang: string) {
  // findOrNull vrátí null jen když CMS odpoví 404, tedy když záznam
  // opravdu neexistuje. Výpadek CMS projde dál jako výjimka — jinak by
  // se dočasný problém tvářil jako trvale neexistující stránka a Next
  // by takovou odpověď uložil do cache.
  return findOrNull(() => getStudyData(id, lang))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params
  const study = await getData(id, lang)

  if (!study) {
    return {}
  }

  const seo = resolveSeo({
    seo: (study as any).seo,
    title: study.name,
    description: (study as any).short_description,
    image: (study as any).image,
    path: `/studies/${id}`,
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

export default async function StudyPage({ params }: Props) {
  const { lang, id } = await params
  const study = await getData(id, lang)

  if (!study) {
    notFound()
  }

  return <StudiesSection {...study} />
}
