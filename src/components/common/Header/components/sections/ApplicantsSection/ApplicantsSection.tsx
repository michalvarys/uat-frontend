import styles from './ApplicantsSection.module.scss'

import { MenuSection } from '../../../Header'
import ConditionalLinkType from '../../../../../navigation/types/ConditionalLinkType'

import LinksSection from '../LinksSection'
import InternalLink from '../../../../../navigation/InternalLink'
import FieldOfStudyButton from '../../FieldOfStudyButton'
import { FieldOfStudyType } from 'src/types/fieldsOfStudy'

type Props = {
  data: MenuSection & {
    bottomLeftLink: ConditionalLinkType
    bottomRightLink: ConditionalLinkType
    studies: FieldOfStudyType[]
  }
}

const ApplicantsSection = ({ data }: Props) => {
  console.log({ data })
  return (
    <div className={styles.container}>
      <div>
        <div className={styles.top_container}>
          <LinksSection links={data.links} />
          <div className={styles.buttons}>
            {data.studies.filter(Boolean).map((item, index) => (
              <FieldOfStudyButton key={`${index}-${item.id}`} study={item} />
            ))}
          </div>
        </div>
        <div className={styles.bottom_container}>
          {data.bottomLeftLink && data.bottomLeftLink.isVisible && (
            <div className={styles.button}>
              <InternalLink path={'/pages/vyssie-odborne-studium'}>
                <span className={styles.text}>
                  <b>{data.bottomLeftLink.title}</b>
                  {` — ${data.bottomLeftLink.subtitle}`}
                </span>
              </InternalLink>
            </div>
          )}
          <div className={styles.divider} />
          {data.bottomRightLink && data.bottomRightLink.isVisible && (
            <div className={styles.button}>
              <InternalLink
                path={'/pages/akademia-filmovej-tvorby-a-multimedii'}
              >
                <span className={styles.text}>
                  <b>{data.bottomRightLink.title}</b>
                  {` — ${data.bottomRightLink.subtitle}`}
                </span>
              </InternalLink>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ApplicantsSection
