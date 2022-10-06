import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from './news.module.scss'

import Container, { ContainerVariant } from '../../components/common/Container'
import { getString, Strings } from '../../locales'
import NewsType from '../../components/news/types/NewsType'
import NewsList from '../../components/news/NewsList'
import YearSwitcher from '../../components/common/YearSwitcher'
import axios from 'axios'
import { YearSwitcherVariant } from '../../components/common/YearSwitcher/YearSwitcher'
import SegmentedControl from '../../components/common/buttons/SegmentedControl'
import { useApp } from '../../components/context/AppContext'
import { setLocalizationData } from '../../utils/localizationsUtils'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'

type NewsPageProps = {
  news: NewsType[]
  years: string[]
}

export default function News({ news, years }: NewsPageProps) {
  const router = useRouter()
  const { setLocalePaths } = useApp()
  const year = (router.query.year || years[0]).toString()
  const [currentFilter, setCurrentFilter] = useState(0)
  const [currentYearIndex, setCurrentYearIndex] = useState(
    years.findIndex((item: string) => item === year)
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
  query,
}: GetServerSidePropsContext): Promise<
  GetServerSidePropsResult<NewsPageProps>
> {
  const { year } = query
  const url = `/news?_locale=${locale}&year=${year}`

  try {
    const { data } = await axios(url)
    const { news, years } = data

    return {
      props: {
        news,
        years,
      },
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
