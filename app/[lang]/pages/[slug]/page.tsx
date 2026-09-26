import type { Metadata } from 'next'
import { findOrNull } from 'src/queries/errors'
import { notFound, permanentRedirect } from 'next/navigation'

import { PageSection } from 'src/sections/pages/PageSection'
import { getPageDetail, getPagesData } from '@/queries/pages'
import { resolveSeo } from 'src/utils/seo'
import { decodeSlug } from 'src/utils/slug'
import { LOCALES, localePath } from 'src/i18n/config'
import { findNewSlug } from 'src/queries/slugHistory'

export const revalidate = 10

// Slug, který není v seznamu, se dogeneruje při prvním požadavku —
// odpovídá to původnímu fallback: 'blocking'.
export const dynamicParams = true

type Props = {
  params: Promise<{ lang: string; slug: string }>
}

export async function generateStaticParams() {
  try {
    const pages = await getPagesData(LOCALES as unknown as string[])

    // Stránky bez slugu jsou rozepsané záznamy v CMS. Build by na nich
    // spadl na "A required parameter (slug) was not provided as a string".
    return pages
      .filter((item) => typeof item.slug === 'string' && item.slug !== '')
      .flatMap((item) => LOCALES.map((lang) => ({ lang, slug: item.slug })))
  } catch {
    return []
  }
}

async function getData(slug: string, lang: string) {
  // findOrNull vrátí null jen když CMS odpoví 404, tedy když záznam
  // opravdu neexistuje. Výpadek CMS projde dál jako výjimka — jinak by
  // se dočasný problém tvářil jako trvale neexistující stránka a Next
  // by takovou odpověď uložil do cache.
  return findOrNull(() => getPageDetail(decodeSlug(slug), lang))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params
  const page = await getData(slug, lang)

  if (!page) {
    return {}
  }

  const seo = resolveSeo({
    seo: (page as any).seo,
    title: page.title,
    sections: page.sections,
    image: page.cover_image,
    path: `/pages/${slug}`,
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

export default async function Page({ params }: Props) {
  const { lang, slug } = await params
  const page = await getData(slug, lang)

  if (!page) {
    // Stránka pod touto adresou neexistuje — než vrátíme 404, ověříme,
    // jestli nejde o starý slug přejmenovaného záznamu.
    const newSlug = await findNewSlug(slug, 'page', lang)
    if (newSlug && newSlug !== slug) {
      permanentRedirect(localePath(`/pages/${newSlug}`, lang))
    }

    notFound()
  }

  return <PageSection {...page} />
}
