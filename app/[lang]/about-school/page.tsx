import type { Metadata } from 'next'

import Container, { ContainerVariant } from 'src/components/common/Container'
import { CmsContent } from 'src/components/CmsContent'
import YoutubePlayerSlice from 'src/components/slices/YoutubePlayerSlice'
import EmploymentStatistics from 'src/components/aboutSchool/EmploymentStatistics'
import ApplicationsAtUniversity from 'src/components/aboutSchool/ApplicationsAtUniversity'
import EUProjectsSlice from 'src/components/slices/EUProjectsSlice'
import ButtonLink, {
  ButtonLinkImageType,
  ButtonLinkVariant,
} from 'src/components/navigation/ButtonLink'
import { getAboutSchoolDetail } from '@/queries/aboutSchool'
import { resolveSeo } from 'src/utils/seo'

import styles from './about-school.module.scss'

export const revalidate = 10

type Props = {
  params: Promise<{ lang: string }>
}

async function getData(lang: string) {
  try {
    return await getAboutSchoolDetail(lang)
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const data = await getData(lang)

  const seo = resolveSeo({
    seo: data?.seo,
    title: data?.title,
    description: data?.description,
    path: '/about-school',
    locale: lang,
  })

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: seo.canonical },
    robots: seo.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.canonical,
      images: seo.image ? [seo.image] : undefined,
    },
  }
}

function renderButtons(buttons: any[]) {
  return (
    <div className={styles.buttons}>
      {buttons.map((item: any) => (
        <div key={`link-${item.id}`}>
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

export default async function AboutSchoolPage({ params }: Props) {
  const { lang } = await params
  const data = await getData(lang)

  if (!data) {
    return null
  }

  return (
    <div style={{ width: '100%' }} className={styles.container}>
      <Container variant={ContainerVariant.Black}>
        <div
          className={`${styles.inner_black_container} ${styles.inner_container}`}
        >
          <h1>{data.title}</h1>
          <div className={styles.top_container}>
            <div className={styles.video_container}>
              <YoutubePlayerSlice data={data.video} />
            </div>
            <CmsContent
              className={styles.description_container}
              data={data.description}
            />
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
            <EmploymentStatistics data={data.employment_statistics} />
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
    </div>
  )
}
