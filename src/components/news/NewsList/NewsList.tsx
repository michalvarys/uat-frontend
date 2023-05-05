import NewsItem from './components/NewsItem'
import NewsType from '../types/NewsType'
import styles from './NewsList.module.scss'

type Props = {
  news: NewsType[]
  onSelect: (item: NewsType) => void
}

const NewsList = ({ news = [], onSelect }: Props) => {
  return (
    <div className={styles.container}>
      {news.map((item: NewsType) => (
        <NewsItem news={item} key={item.id} onSelect={onSelect} />
      ))}
    </div>
  )
}

export default NewsList
