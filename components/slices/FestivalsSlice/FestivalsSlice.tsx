import { useRouter } from 'next/router'

import styles from './FestivalsSlice.module.scss'

import FestivalType from '../../festivals/types/FestivalType'
import { ContainerVariant } from '../../common/Container'
import DescriptionSection from '../../common/DescriptionSection'
import FestivalsGrid from './components/FestivalsGrid'

type Props = {
  festivals?: FestivalType[]
  variant: ContainerVariant
}

const FestivalsSlice = ({ festivals, variant }: Props) => {
  const router = useRouter()

  if (!festivals || festivals.length === 0) {
    return <></>
  }

  const [promotedFestival] = festivals

  const onSelectFestival = (item: FestivalType) => {
    router.push(`/festivals/${item.id}`)
  }

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        {promotedFestival && (
          <DescriptionSection
            data={{
              title: promotedFestival.title,
              subtitle: promotedFestival.subtitle,
              content: promotedFestival.description,
            }}
            isGreen
            variant={variant}
          />
        )}
      </div>

      <div className={styles.right}>
        <FestivalsGrid festivals={festivals} onSelect={onSelectFestival} />
      </div>
    </div>
  )
}

export default FestivalsSlice
