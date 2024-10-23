import Head from 'next/head'
import { useRouter } from 'next/router'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'

import { Strings, getString } from 'src/locales'
import { REVALIDATE_TIME } from 'src/constants'
import { chakra } from '@chakra-ui/react'
import {
  HomeSection,
  HomeSectionProps,
} from 'src/sections/homepage/HomeSection'
import { PageProps } from './_app'
import { getHomepageData } from 'src/queries/homepage'

export default function Home(props: PageProps<HomeSectionProps>) {
  console.log(props)
  const { locale } = useRouter()
  const title = getString(locale, Strings.HOME_PAGE_TITLE)

  return (
    <chakra.div w="full">
      <Head>
        <title>{title}</title>
      </Head>

      <HomeSection
        {...{
          ...props,
          social: {
            ...props.menuData.footer,
          },
        }}
      />
    </chakra.div>
  )
}

export async function getStaticProps({
  locale: lang,
  defaultLocale,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<unknown>> {
  const locale = lang || defaultLocale

  try {
    const homepage = await getHomepageData(locale)

    return {
      props: homepage,
      revalidate: REVALIDATE_TIME,
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e)
    return {
      props: {},
      revalidate: REVALIDATE_TIME,
    }
  }
}
