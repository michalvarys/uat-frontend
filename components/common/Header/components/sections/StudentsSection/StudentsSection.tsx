import classNames from 'classnames'
import styles from './StudentsSection.module.scss'

import LinksSection from '../LinksSection'
import { MenuSection } from '../../../Header'
import CommonBigButton from '../../CommonBigButtons'
import ConditionalLinkType from '../../../../../navigation/types/ConditionalLinkType'

type Props = {
  data: MenuSection & {
    news: ConditionalLinkType
    documents: ConditionalLinkType
  }
}

const StudentsSection = ({ data }: Props) => (
  <div className={styles.container}>
    <LinksSection links={data.links} />
    <CommonBigButton news={data.news} documents={data.documents} />
  </div>
)

export default StudentsSection
