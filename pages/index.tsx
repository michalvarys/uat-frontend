import Head from 'next/head'
import axios from 'axios'
import { useRouter } from 'next/router'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'

import { Strings, getString } from 'src/locales'
import { REVALIDATE_TIME } from 'src/constants'
import { chakra } from '@chakra-ui/react'
import {
  HomeSection,
  HomeSectionProps,
} from 'src/sections/homepage/HomeSection'

export default function Home(props: HomeSectionProps) {
  const { locale } = useRouter()
  const title = getString(locale, Strings.HOME_PAGE_TITLE)
  console.log({ props })

  return (
    <chakra.div w="full">
      <Head>
        <title>{title}</title>
      </Head>

      <HomeSection {...props} />
    </chakra.div>
  )
}

export async function getStaticProps({
  locale,
  defaultLocale,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<unknown>> {
  const url = `/home-page?_locale=${locale || defaultLocale}&inl=${6}`

  try {
    const { data } = await axios(url)
    if (!data) {
      throw new Error('no data')
    }

    return {
      props: { ...data, url },
      revalidate: REVALIDATE_TIME,
    }
  } catch (e) {
    return {
      props: {},
      revalidate: REVALIDATE_TIME,
    }
  }
}
