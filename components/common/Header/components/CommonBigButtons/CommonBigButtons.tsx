import styles from './CommonBigButtons.module.scss'

import BigButton from '../BigButton'
import ConditionalLinkType from '../../../../navigation/types/ConditionalLinkType'

import NewsIcon from '../../../../../public/icons/common/news.svg'
import DocumentsIcon from '../../../../../public/icons/common/documents.svg'

type Props = {
  news: ConditionalLinkType
  documents: ConditionalLinkType
}

const CommonBigButton = ({ news, documents }: Props) => {
  if (!news || !documents) {
    return <></>
  }
  return (
    <div className={styles.container}>
      {documents.isVisible && (
        <div className={styles.button_container}>
          <BigButton
            image={DocumentsIcon}
            title={documents.title}
            path={'/documents'}
          />
        </div>
      )}
      {news.isVisible && (
        <div className={styles.button_container}>
          <BigButton image={NewsIcon} title={news.title} path={'/news'} />
        </div>
      )}
    </div>
  )
}

export default CommonBigButton
