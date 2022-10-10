import axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import styles from './about-school.module.scss'

import Container, { ContainerVariant } from 'src/components/common/Container'

import YoutubePlayerSlice from 'src/components/slices/YoutubePlayerSlice'
import AboutSchoolType from 'src/components/aboutSchool/types/AboutSchoolType'
import EmploymentStatistics from 'src/components/aboutSchool/EmploymentStatistics'
import ApplicationsAtUniversity from 'src/components/aboutSchool/ApplicationsAtUniversity'
import EUProjectsSlice from 'src/components/slices/EUProjectsSlice'
import ButtonLink, {
  ButtonLinkImageType,
  ButtonLinkVariant,
} from 'src/components/navigation/ButtonLink'
import { useEffect } from 'react'
import { useApp } from 'src/components/context/AppContext'
import { setLocalizationData } from 'src/utils/localizationsUtils'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { chakra } from '@chakra-ui/react'

type AboutSchoolPageProps = {
  data: AboutSchoolType
}

export default function AboutSchoolPage({ data }: AboutSchoolPageProps) {
  const router = useRouter()
  const { setLocalePaths } = useApp()

  useEffect(() => {
    setLocalizationData(setLocalePaths, null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const renderButtons = (buttons: any[]) => {
    return (
      <div className={styles.buttons}>
        {buttons.map((item: any) => (
          <div key={`link-=${item.id}`}>
            <ButtonLink
              imageType={
                item.__component.includes('download')
                  ? ButtonLinkImageType.Download
                  : ButtonLinkImageType.Arrow
              }
              title={item.title}
              path={item.url || item.path}
              variant={ButtonLinkVariant.Black}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <chakra.div w="full" className={styles.container}>
      <Head>
        <title>{data.title}</title>
      </Head>

      <Container variant={ContainerVariant.Black}>
        <div
          className={`${styles.inner_black_container} ${styles.inner_container}`}
        >
          <h1>{data.title}</h1>
          <div className={styles.top_container}>
            <div className={styles.video_container}>
              <YoutubePlayerSlice data={data.video} />
            </div>
            <div className={styles.description_container}>
              {data.description}
            </div>
          </div>
          {data.buttons &&
            data.buttons.length > 0 &&
            renderButtons(data.buttons)}
        </div>
      </Container>

      <Container variant={ContainerVariant.White}>
        <div
          className={`${styles.inner_container} ${styles.inner_white_container}`}
        >
          <div className={styles.statistics_container}>
            <EmploymentStatistics data={data.EmploymentStatistics} />
          </div>
        </div>
      </Container>

      <Container variant={ContainerVariant.Black}>
        <div
          className={`${styles.inner_application_container} ${styles.inner_container}`}
        >
          <ApplicationsAtUniversity data={data.applications_at_university} />
        </div>
      </Container>

      <Container variant={ContainerVariant.White}>
        <div
          className={`${styles.inner_application_container} ${styles.inner_container}`}
        >
          <EUProjectsSlice projects={data.eu_projects} />
        </div>
      </Container>
    </chakra.div>
  )
}

export async function getServerSideProps({
  locale,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<unknown>> {
  try {
    const url = `/about-school?_locale=${locale}`
    const { data } = await axios(url)

    return {
      props: {
        data,
      },
    }
  } catch (e) {
    return {
      props: {},
    }
  }
}
