import styles from './FestivalSection.module.scss'

import LinksSection from '../LinksSection'
import { MenuSection } from '../../../Header'
import ImageLink from '../../../../../navigation/ImageLink'
import { transformLink } from 'src/utils/link'

type Props = {
  data: MenuSection & {
    festivals: any[]
  }
}

const FestivalSection = ({ data }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.links}>
        <LinksSection links={data.links} />
      </div>
      <div className={styles.festivals}>
        {data.festivals.map(
          (festival, idx: number) =>
            festival.thumbnail && (
              <ImageLink
                key={`image-link-${idx}-${festival.thumbnail.hash}`}
                title={festival.title}
                subtitle={festival.subtitle}
                image={transformLink(festival.thumbnail.url)}
                imageWidth={festival.thumbnail.width}
                imageHeight={festival.thumbnail.height}
                url={`/festivals/${festival.id}`}
              />
            )
        )}
      </div>
    </div>
  )
}

export default FestivalSection
