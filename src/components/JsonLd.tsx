import { SITE_URL } from 'src/constants'

/**
 * Strukturovaná data pro vyhledávače.
 *
 * Next doporučuje nativní <script>, ne next/script — JSON-LD jsou data,
 * ne spustitelný kód. Escapování `<` je povinné: JSON.stringify proti
 * XSS nechrání a hodnoty sem chodí z CMS.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}

/** Škola jako organizace — patří na každou stránku, proto do layoutu. */
export function organizationJsonLd(lang: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Súkromná škola umeleckého priemyslu animovanej tvorby',
    alternateName: 'SŠUPAT',
    url: SITE_URL,
    logo: `${SITE_URL}/icons/common/logo-black.svg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Vlastenecké námestie 1',
      addressLocality: 'Bratislava',
      postalCode: '851 01',
      addressCountry: 'SK',
    },
    inLanguage: lang,
  }
}

export function articleJsonLd({
  title,
  description,
  image,
  url,
  published,
  modified,
}: {
  title: string
  description?: string
  image?: string
  url: string
  published?: string
  modified?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description,
    image: image ? [image] : undefined,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    datePublished: published,
    dateModified: modified || published,
    publisher: {
      '@type': 'Organization',
      name: 'SŠUPAT',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icons/common/logo-black.svg`,
      },
    },
  }
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
