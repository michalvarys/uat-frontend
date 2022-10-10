import { useEffect } from 'react'
import axios from 'axios'
import Head from 'next/head'
import styles from './studies.module.scss'

import Container, { ContainerVariant } from 'src/components/common/Container'
import FieldOfStudyType from 'src/components/fields/types/FieldOfStudyType'
import FieldOfStudyHeader from 'src/components/fields/FieldOfStudyHeader'
import MultiGallerySlice from 'src/components/slices/MultiGallerySlice'
import TextWithImageType from 'src/components/slices/types/TextWithImageType'
import TextWithImageSlice from 'src/components/slices/TextWithImageSlice'
import TeachersCarusel from 'src/components/teachers/TeachersCarusel'

import { REVALIDATE_TIME } from 'src/constants'
import Subjects from 'src/components/fields/Subjects'
import { useApp } from 'src/components/context/AppContext'
import { setLocalizationData } from 'src/utils/localizationsUtils'
import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import { localesToParams } from 'src/utils/params'

type FieldOfStudyProps = {
  study: FieldOfStudyType
}

export default function FieldOfStudy({ study }: FieldOfStudyProps) {
  const { setLocalePaths } = useApp()

  useEffect(() => {
    if (study && study.localizations.length > 0) {
      setLocalizationData(setLocalePaths, study.localizations, '/studies')
    } else {
      setLocalizationData(setLocalePaths, null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [study])

  if (!study) {
    return <></>
  }

  const renderSlice = (slice: any, index: number) => {
    switch (slice.__component) {
      case 'shared.text-with-image':
        return (
          <TextWithImageSlice
            key={`text-with-image-${slice.id}`}
            data={slice}
            extraTextTopSpace={120}
          />
        )
      case 'shared.subjects':
        return <Subjects key={`subjects-${slice.id}`} subjects={slice} />
      default:
        return null
    }
  }
  return (
    <>
      <Head>
        <title>{study.name}</title>
      </Head>
      <Container variant={ContainerVariant.Black} isHigh>
        <FieldOfStudyHeader data={study} />

        {study.teachers && (
          <TeachersCarusel isTitle teachers={study.teachers} />
        )}
      </Container>
      <Container variant={ContainerVariant.White}>
        <div>
          {study.content.map((item: TextWithImageType, index: number) =>
            renderSlice(item, index)
          )}
        </div>
        <div className={styles.galleries_container}>
          <MultiGallerySlice galleries={study.galleries} isSmall />
        </div>
      </Container>
    </>
  )
}

type Params = { id: string }

export async function getStaticPaths({
  locales,
}: GetStaticPropsContext): Promise<GetStaticPathsResult<Params>> {
  const params = localesToParams(locales)
  const url = `/cms/field-of-studies?${params}`

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
  const url = `/field-of-studies/${params!.id}?_locale=${locale}`

  try {
    const { data: study } = await axios(url)

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
    return {
      redirect: {
        destination: '/500',
        permanent: false,
      },
      revalidate: REVALIDATE_TIME,
    }
  }
}
