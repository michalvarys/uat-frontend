import { useEffect } from 'react'
import axios from 'axios'
import Head from 'next/head'
import styles from './studies.module.scss'

import Container, { ContainerVariant } from '../../components/common/Container'
import FieldOfStudyType from '../../components/fields/types/FieldOfStudyType'
import FieldOfStudyHeader from '../../components/fields/FieldOfStudyHeader'
import MultiGallerySlice from '../../components/slices/MultiGallerySlice'
import TextWithImageType from '../../components/slices/types/TextWithImageType'
import TextWithImageSlice from '../../components/slices/TextWithImageSlice'
import TeachersCarusel from '../../components/teachers/TeachersCarusel'

import { REVALIDATE_TIME } from '../../consts/app.consts'
import Subjects from '../../components/fields/Subjects'
import { useApp } from '../../components/context/AppContext'
import { setLocalizationData } from '../../utils/localizationsUtils'
import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import { localesToParams } from '../../utils/params'

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
