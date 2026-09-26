'use client'

import { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import Container, { ContainerVariant } from 'src/components/common/Container'
import { getString, Strings } from 'src/locales'
import NewsType from 'src/components/news/types/NewsType'
import YearSwitcher from 'src/components/common/YearSwitcher'
import { YearSwitcherVariant } from 'src/components/common/YearSwitcher/YearSwitcher'
import SegmentedControl from 'src/components/common/buttons/SegmentedControl'
import NewsList from 'src/components/slices/NewsList'
import { localePath } from 'src/i18n/config'

import styles from './news.module.scss'

type Props = {
  news: NewsType[]
  years: string[]
  fetchedYear: string
  lang: string
}

export default function NewsListView({
  news,
  years,
  fetchedYear,
  lang,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentFilter, setCurrentFilter] = useState(0)

  const year = useMemo(
    () => (searchParams.get('year') || fetchedYear || years[0])?.toString(),
    [searchParams, fetchedYear, years]
  )

  const currentYearIndex = years.findIndex((item) => item.toString() === year)

  const filteringMethod = (item: NewsType) => {
    if (currentFilter === 0) {
      return true
    }
    if (currentFilter === 1) {
      return item.important_news
    }
    return !item.important_news
  }

  const onSelectNews = (item: NewsType) => {
    router.push(localePath(`/news/${item.slug}`, lang))
  }

  const onSelectYear = (index: number) => {
    router.push(`${localePath('/news', lang)}?year=${years[index]}`)
  }

  return (
    <Container variant={ContainerVariant.Orange}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>{getString(lang, Strings.NEWS)}</h1>
          <SegmentedControl
            current={currentFilter}
            onSelect={setCurrentFilter}
            items={[
              getString(lang, Strings.ALL_NEWS) || '',
              getString(lang, Strings.ANNOUNCEMENTS) || '',
              getString(lang, Strings.ONLY_NEWS) || '',
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
