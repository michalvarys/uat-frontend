import { useEffect } from 'react'
import Head from 'next/head'
import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import { REVALIDATE_TIME } from 'src/constants'
import PageType from 'src/components/pages/types/PageType'
import { useApp } from 'src/components/context/AppContext'
import { setLocalizationData } from 'src/utils/localizationsUtils'
import { PageSection } from 'src/sections/pages/PageSection'
import { getPageDetail, getPagesData } from '@/queries/pages'

import 'moment/locale/sk'

type PageProps = {
  slug?: string
  page: PageType | null
}

export default function Page({ page }: PageProps) {
  const { setLocalePaths } = useApp()

  useEffect(() => {
    if (page?.localizations?.length > 0) {
      setLocalizationData(
        setLocalePaths,
        page.localizations.map((item) => ({ id: item.id, attributes: item })),
        '/pages'
      )
      return
    }

    setLocalizationData(setLocalePaths, null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  return (
    <>
      <Head>
        <title>{page.title}</title>
      </Head>
      <PageSection {...page} />
    </>
  )
}

export async function getStaticPaths({
  locales,
}: GetStaticPathsContext): Promise<GetStaticPathsResult<{}>> {
  try {
    const pages = await getPagesData(locales)
    return {
      // Stránky bez slugu (rozepsané záznamy v CMS) by build shodily na
      // "A required parameter (slug) was not provided as a string".
      // Do předgenerování nepatří; fallback 'blocking' je stejně doplní,
      // až slug dostanou.
      paths: pages
        .filter((item) => typeof item.slug === 'string' && item.slug !== '')
        .map((item) => ({
          params: {
            slug: item.slug,
            page: item,
          },
        })),
      fallback: 'blocking',
    }
  } catch (e) {
    return {
      paths: [],
      fallback: 'blocking',
    }
  }
}

export async function getStaticProps({
  locale,
  params,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<PageProps>> {
  try {
    const page = await getPageDetail(params!.slug as string, locale)
    if (!page) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        page,
      },
      revalidate: REVALIDATE_TIME,
    }
  } catch (e) {
    return {
      redirect: {
        destination: '/500',
        permanent: false,
      },
      revalidate: REVALIDATE_TIME,
    }
  }
}
