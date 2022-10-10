import parse from 'html-react-parser'
import Image from 'next/image'

import styles from './NewsItem.module.scss'

import NewsType from '../../../types/NewsType'

import ArrowRightIcon from 'public/icons/common/arrow_right.svg'

type Props = {
  news: NewsType
  onSelect: (item: NewsType) => void
}

const NewsItem = ({ news, onSelect }: Props) => {
  const textData = news.sections.find(
    (item: any) => item.__component === 'shared.rich-text-with-title'
  )
  const text = textData && textData.content ? textData.content : ''

  return (
    <div className={styles.container} onClick={() => onSelect(news)}>
      <div className={styles.content}>
        <span className={styles.title}>{news.title}</span>
        <span className={styles.sneak_peak}>{parse(text)}</span>
      </div>
      <Image src={ArrowRightIcon} alt={'arrow'} />
    </div>
  )
}

export default NewsItem
