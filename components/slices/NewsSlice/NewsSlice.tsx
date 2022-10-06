import styles from './NewsSlice.module.scss'

import { transformLink } from '../../../utils/transformLink'
import NewsType from '../../news/types/NewsType'
import NewsList from '../../news/NewsList'
import { getString, Strings } from '../../../locales'
import { useRouter } from 'next/router'

type Props = {
  news: NewsType[]
}

const NewsSlice = ({ news }: Props) => {
  const router = useRouter()

  const onSelectNews = (news: NewsType) => {
    router.push(`/news/${news.slug}`)
  }

  return (
    <div className={styles.container}>
      <div className={styles.wave} />
      <h1 className={styles.header}>
        {getString(router.locale, Strings.NEWS)}
      </h1>
      <NewsList news={news} onSelect={onSelectNews} />
    </div>
  )
}

export default NewsSlice
