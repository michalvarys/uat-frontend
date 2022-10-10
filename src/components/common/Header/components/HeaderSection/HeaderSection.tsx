import classNames from 'classnames'
import styles from './HeaderSection.module.scss'

import ApplicantsSection from '../sections/ApplicantsSection'
import FestivalSection from '../sections/FestivalSection'
import SchoolSection from '../sections/SchoolSection'
import StudentsSection from '../sections/StudentsSection'
import { MenuSection } from '../../Header'
import Container from '../../../Container'
import ConditionalLinkType from '../../../../navigation/types/ConditionalLinkType'

type Props = {
  data: any
  sectionIndex: number
  isMobile?: boolean
}

const HeaderSection = ({ isMobile = false, data, sectionIndex }: Props) => {
  const renderSection = () => {
    switch (sectionIndex) {
      case 0:
        return <ApplicantsSection data={data} />
      case 1:
        return <StudentsSection data={data} />
      case 2:
        return <SchoolSection data={data} />
      case 3:
        return <FestivalSection data={data} />
      default:
        return null
    }
  }

  return (
    <Container>
      <div
        className={classNames({
          [styles.container]: true,
          [styles.container_mobile]: isMobile,
          [styles.container_menu_0]: sectionIndex === 0,
          [styles.container_menu_1]: sectionIndex === 1,
          [styles.container_menu_2]: sectionIndex === 2,
          [styles.container_menu_3]: sectionIndex === 3,
        })}
      >
        <div className={styles.inner_container}>{renderSection()}</div>
      </div>
    </Container>
  )
}

export default HeaderSection
