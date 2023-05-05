import { useEffect } from 'react'
import Head from 'next/head'
import axios from 'axios'
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
import { localesToParams } from 'src/utils/params'
import { PageSection } from 'src/sections/pages/PageSection'

import 'moment/locale/sk'

type PageProps = {
  slug?: string
  page: PageType | null
}

export default function Page({ page }: PageProps) {
  const { setLocalePaths } = useApp()

  useEffect(() => {
    if (page.localizations?.length > 0) {
      setLocalizationData(setLocalePaths, page.localizations, '/pages')
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
  const params = localesToParams(locales!)
  const url = `/cms/pages?${params}`

  try {
    const { data: pages } = await axios.get<PageType[]>(url)

    return {
      paths: pages.map((item) => ({
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
  const url = `/pages?_locale=${locale}&slug=${params!.slug}`

  try {
    const { data: pages } = await axios(url)
    const page = pages?.length > 0 ? pages[0] : null
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
