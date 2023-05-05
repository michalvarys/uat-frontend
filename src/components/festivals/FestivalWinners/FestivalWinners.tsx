import Image from 'next/image'

import styles from './FestivalWinners.module.scss'

import ArrowIcon from 'public/icons/common/arrow_right.svg'
import FestivalWinnerType from '../types/FestivalWinner'
import { transformLink } from 'src/utils/link'
import { useState } from 'react'
import { getString, Strings } from 'src/locales'
import { useRouter } from 'next/router'
import YearSwitcher from '../../common/YearSwitcher'
import { YearSwitcherVariant } from '../../common/YearSwitcher/YearSwitcher'

type Props = {
  winners: {
    id: number
    single_winner: FestivalWinnerType[]
    year: string
  }[]
}

type WinnerItemPros = {
  winner: FestivalWinnerType
}

const WinnerItem = ({ winner }: WinnerItemPros) => {
  return (
    <a className={styles.item} href={winner.link}>
      <div className={styles.image}>
        {winner.image && (
          <Image
            src={transformLink(winner.image.url)}
            width={winner.image.width}
            height={winner.image.height}
            alt="icon"
            layout={'responsive'}
            objectFit={'cover'}
            objectPosition={'center center'}
          />
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.text}>
          <div className={styles.place}>{winner.place}</div>
          <div className={styles.title}>{winner.title}</div>
          <div className={styles.author}>{winner.author}</div>
          <div className={styles.subtitle}>{winner.subtitle}</div>
        </div>
        <div className={styles.arrow}>
          <Image src={ArrowIcon} alt="arrow" />
        </div>
      </div>
    </a>
  )
}

const FieldOfStudyCarusel = ({ winners }: Props) => {
  const [currentWinners, setCurrentWinners] = useState(0)

  const router = useRouter()
  return (
    <div className={styles.container}>
      <div className={styles.top_container}>
        <h1>{getString(router.locale, Strings.PREVIOUS_WINNERS)}</h1>
        <div>
          <YearSwitcher
            current={currentWinners}
            years={winners.map((item) => item.year)}
            onSelect={(index: number) => setCurrentWinners(index)}
            variant={YearSwitcherVariant.WhiteBackground}
          />
        </div>
      </div>

      <div className={styles.card_container}>
        {winners[currentWinners].single_winner.map(
          (item) =>
            item && <WinnerItem key={`winner-${item.id}`} winner={item} />
        )}
      </div>
    </div>
  )
}

export default FieldOfStudyCarusel
