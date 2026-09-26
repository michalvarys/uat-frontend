import type { Metadata } from 'next'

import { getDocumentList } from '@/queries/documents'
import { getString, Strings } from 'src/locales'
import { resolveSeo } from 'src/utils/seo'

import DocumentsView from './DocumentsView'

// Next vyhodnocuje segment config staticky, takže tu musí být literál,
// ne import z konstant (REVALIDATE_TIME = 10).
export const revalidate = 10

type Props = {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const seo = resolveSeo({
    title: getString(lang, Strings.DOCUMENTS),
    path: '/documents',
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

export default async function DocumentsPage({ params }: Props) {
  const { lang } = await params

  // Dřív běželo přes getServerSideProps, přestože se nic nefiltruje podle
  // requestu — stránka se tak generovala znovu při každém načtení.
  const documents = await getDocumentList()

  return <DocumentsView documents={documents} lang={lang} />
}
