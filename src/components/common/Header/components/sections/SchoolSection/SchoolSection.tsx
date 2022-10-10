import parse from 'html-react-parser'
import styles from './SchoolSection.module.scss'

import LinksSection from '../LinksSection'
import { MenuSection } from '../../../Header'
import CommonBigButton from '../../CommonBigButtons'
import ConditionalLinkType from '../../../../../navigation/types/ConditionalLinkType'
import RichTextType from '../../../../../../types/data/RichTextType'

type Props = {
  data: MenuSection & {
    news: ConditionalLinkType
    documents: ConditionalLinkType
    contactSections: RichTextType[]
  }
}

const SchoolSection = ({ data }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.top_container}>
        <LinksSection links={data.links} />
        <CommonBigButton news={data.news} documents={data.documents} />
      </div>

      <div className={styles.bottom_container}>
        {data.contactSections?.map((item: RichTextType) => (
          <div className={styles.section} key={item.id}>
            {item.title && <span className={styles.title}>{item.title}</span>}
            {parse(item.content)}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SchoolSection
