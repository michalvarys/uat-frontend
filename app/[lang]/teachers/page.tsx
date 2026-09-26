import { Suspense } from 'react'
import type { Metadata } from 'next'

import { getTeachersData } from 'src/queries/teachers'
import { getString, Strings } from 'src/locales'
import { resolveSeo } from 'src/utils/seo'

import TeachersView from './TeachersView'

export const revalidate = 10

type Props = {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const seo = resolveSeo({
    title: getString(lang, Strings.TEACHING_STUFF),
    path: '/teachers',
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

export default async function TeachersPage({ params }: Props) {
  const { lang } = await params
  const teachers = await getTeachersData(lang)

  // TeachersView čte ?id= přes useSearchParams; při statickém generování
  // to Next vyžaduje uvnitř Suspense.
  return (
    <Suspense fallback={null}>
      <TeachersView teachers={teachers} lang={lang} />
    </Suspense>
  )
}
