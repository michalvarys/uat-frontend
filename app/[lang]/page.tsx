import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Strings, getString } from 'src/locales'
import { HomeSection } from 'src/sections/homepage/HomeSection'
import { getHomepageData } from 'src/queries/homepage'
import { getInitialPropsData } from 'src/queries/initial'
import { resolveSeo } from 'src/utils/seo'

export const revalidate = 10

type Props = {
  params: Promise<{ lang: string }>
}

/**
 * Úvodní stránka v CMS vždy existuje, takže selhání dotazu znamená výpadek,
 * ne chybějící obsah. Chybu proto nepolykáme: kdyby se vrátilo null,
 * vykreslila by se prázdná stránka se stavem 200 — a ta by se navíc
 * na `revalidate` sekund uložila do cache, takže by prázdná zůstala
 * i pro další návštěvníky. Výjimka místo toho spustí error.tsx
 * a Next se o obsah pokusí znovu při dalším požadavku.
 */
async function getData(lang: string) {
  return getHomepageData(lang)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const data = await getData(lang)

  const seo = resolveSeo({
    seo: (data as any)?.seo,
    title: getString(lang, Strings.HOME_PAGE_TITLE),
    description: (data as any)?.subtitle,
    image: (data as any)?.cover_image,
    path: '/',
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
      type: 'website',
      images: seo.image ? [seo.image] : undefined,
    },
  }
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params
  const [data, menuData] = await Promise.all([
    getData(lang),
    getInitialPropsData(lang).catch(() => null),
  ])

  // Dotaz už chybu nepolyká, takže sem se dojde jen když CMS obsah
  // opravdu nemá. Prázdná stránka se stavem 200 by se zaindexovala
  // jako plnohodnotná, proto 404.
  if (!data) {
    notFound()
  }

  return (
    <div style={{ width: '100%' }}>
      <HomeSection
        {...(data as any)}
        social={{ ...(menuData?.footer || {}) }}
      />
    </div>
  )
}
