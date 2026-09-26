import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'

import { SITE_URL } from 'src/constants'
import { getInitialPropsData } from 'src/queries/initial'
import { LOCALES, isLocale, type Locale } from 'src/i18n/config'
import { Providers } from 'src/components/Providers'
import Layout from 'src/components/common/Layout'
import { JsonLd, organizationJsonLd } from 'src/components/JsonLd'

export const revalidate = 300

// Předgenerují se obě jazykové varianty.
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params

  return {
    // Bez metadataBase by relativní URL v OG tazích a canonical
    // skončily jako build error.
    metadataBase: new URL(SITE_URL),
    title: {
      default:
        lang === 'en'
          ? 'Private secondary art school of animation'
          : 'Súkromná škola umeleckého priemyslu animovanej tvorby',
      template: '%s | SŠUPAT',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  }
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  if (!isLocale(lang)) {
    notFound()
  }

  // Menu a patička se dřív načítaly v App.getInitialProps, což celou
  // aplikaci drželo v server-side renderingu na každý požadavek.
  // Tady se načtou jednou při generování a obnoví se podle revalidate.
  const menuData = await getMenuData(lang)

  return (
    <html lang={lang}>
      <body>
        <JsonLd data={organizationJsonLd(lang)} />
        <Providers lang={lang as Locale} langs={LOCALES}>
          <div id="modal-root" />
          <Layout menu={menuData?.menu} footer={menuData?.footer}>
            <>{children}</>
          </Layout>
        </Providers>
      </body>
    </html>
  )
}

async function getMenuData(lang: string) {
  try {
    return await getInitialPropsData(lang)
  } catch {
    // Výpadek CMS nesmí shodit celý web — layout se vykreslí bez menu.
    return { menu: [], footer: null } as any
  }
}
