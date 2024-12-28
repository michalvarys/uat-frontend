import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Container, { ContainerVariant } from 'src/components/common/Container'
import { getString, Strings } from 'src/locales'
import NewsType from 'src/components/news/types/NewsType'
import YearSwitcher from 'src/components/common/YearSwitcher'
import { YearSwitcherVariant } from 'src/components/common/YearSwitcher/YearSwitcher'
import SegmentedControl from 'src/components/common/buttons/SegmentedControl'
import { useApp } from 'src/components/context/AppContext'
import { setLocalizationData } from 'src/utils/localizationsUtils'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import NewsList from 'src/components/slices/NewsList'
import { getNewsByYear } from '@/queries/news'
import styles from './news.module.scss'

type NewsPageProps = {
  news: NewsType[]
  years: string[]
  year: string
}

export default function News({
  news,
  years,
  year: fetchedYear,
}: NewsPageProps) {
  const router = useRouter()
  const { setLocalePaths } = useApp()
  const year = useMemo(
    () => (router.query.year || fetchedYear || years[0])?.toString(),
    [router.query.year, years, fetchedYear]
  )
  const [currentFilter, setCurrentFilter] = useState(0)
  const [currentYearIndex, setCurrentYearIndex] = useState(
    years.findIndex((item) => item.toString() === year)
  )

  useEffect(() => {
    setLocalizationData(setLocalePaths, null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteringMethod = (item: NewsType) => {
    if (currentFilter === 0) {
      return true
    }
    if (currentFilter === 1) {
      return item.important_news
    }
    if (currentFilter === 2) {
      return !item.important_news
    }
  }

  const onSelectNews = (news: NewsType) => {
    router.push(`/news/${news.slug}`)
  }

  const onSelectYear = (index: number) => {
    setCurrentYearIndex(index)
    router.push(`/news?year=${years[index]}`)
  }
  return (
    <Container variant={ContainerVariant.Orange}>
      <Head>
        <title>{getString(router.locale, Strings.NEWS)}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>{getString(router.locale, Strings.NEWS)}</h1>
          <SegmentedControl
            current={currentFilter}
            onSelect={(current: number) => setCurrentFilter(current)}
            items={[
              getString(router.locale, Strings.ALL_NEWS) || '',
              getString(router.locale, Strings.ANNOUNCEMENTS) || '',
              getString(router.locale, Strings.ONLY_NEWS) || '',
            ]}
          />
        </div>
        <div>
          <YearSwitcher
            years={years}
            current={currentYearIndex}
            onSelect={onSelectYear}
            variant={YearSwitcherVariant.OrangeBackground}
          />
        </div>
        <div>
          <NewsList
            news={news.filter(filteringMethod)}
            onSelect={onSelectNews}
          />
        </div>
      </div>
    </Container>
  )
}

export async function getServerSideProps({
  locale,
  query: q,
}: GetServerSidePropsContext): Promise<
  GetServerSidePropsResult<NewsPageProps>
> {
  try {
    const props = await getNewsByYear(q, locale)
    return {
      props,
    }
  } catch (e) {
    return {
      redirect: {
        destination: '/500',
        permanent: false,
      },
    }
  }
}
