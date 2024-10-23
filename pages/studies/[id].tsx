import { useEffect } from 'react'
import axios from 'axios'
import Head from 'next/head'
import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'

import { REVALIDATE_TIME } from 'src/constants'
import { useApp } from 'src/components/context/AppContext'
import { setLocalizationData } from 'src/utils/localizationsUtils'
import { localesToParams } from 'src/utils/params'
import { StudiesSection } from 'src/sections/studies/StudiesSection'
import { FieldOfStudyType } from 'src/types/fieldsOfStudy'

import { getStudyData } from 'src/queries/studies'

type FieldOfStudyProps = {
  study: FieldOfStudyType
}

export default function FieldOfStudy({ study }: FieldOfStudyProps) {
  const { setLocalePaths } = useApp()

  useEffect(() => {
    if (study?.localizations.length > 0) {
      setLocalizationData(setLocalePaths, study.localizations, '/studies')
    } else {
      setLocalizationData(setLocalePaths, null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [study])

  if (!study) {
    return null
  }

  return (
    <>
      <Head>
        <title>{study.name}</title>
      </Head>
      <StudiesSection {...study} />
    </>
  )
}

type Params = { id: string }

export async function getStaticPaths({
  locales,
}: GetStaticPropsContext): Promise<GetStaticPathsResult<Params>> {
  // TODO
  const params = localesToParams(locales)
  const url = `/api/field-of-studies?${params}`

  try {
    const { data: studies } = await axios.get<FieldOfStudyType[]>(url)

    return {
      paths: studies.map((item) => ({
        params: {
          id: item.id.toString(),
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
}: GetStaticPropsContext<Params>): Promise<
  GetStaticPropsResult<FieldOfStudyProps>
> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const study = await getStudyData(params!.id, locale)

    if (!study) {
      return {
        notFound: true,
        revalidate: REVALIDATE_TIME,
      }
    }

    return {
      props: {
        study,
      },
      revalidate: REVALIDATE_TIME,
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e)
    return {
      redirect: {
        destination: '/500',
        permanent: false,
      },
      revalidate: REVALIDATE_TIME,
    }
  }
}
