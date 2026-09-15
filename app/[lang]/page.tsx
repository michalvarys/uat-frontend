import type { Metadata } from 'next'

import { Strings, getString } from 'src/locales'
import { HomeSection } from 'src/sections/homepage/HomeSection'
import { getHomepageData } from 'src/queries/homepage'
import { getInitialPropsData } from 'src/queries/initial'
import { resolveSeo } from 'src/utils/seo'

export const revalidate = 10

type Props = {
  params: Promise<{ lang: string }>
}

async function getData(lang: string) {
  try {
    return await getHomepageData(lang)
  } catch {
    return null
  }
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

  if (!data) {
    return null
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
