import { useRouter } from 'next/router'
import { useState } from 'react'
import { Strings, getString } from '../../../locales'
import YearSwitcher from '../../common/YearSwitcher'
import { YearSwitcherVariant } from '../../common/YearSwitcher/YearSwitcher'
import EmploymentStatisticsType, {
  StatisticEntries,
  StatisticsSingleEntry,
} from '../types/EmploymentStatisticsType'

import styles from './EmploymentStatistics.module.scss'

type StatsEntryProps = {
  title: string
  value: string
}
const StatsEntry = ({ title, value }: StatsEntryProps) => (
  <div className={styles.entry}>
    <div className={styles.title}>{title}</div>
    <span>{value}</span>
  </div>
)

type Props = {
  data: EmploymentStatisticsType
}

const EmploymentStatistics = ({ data }: Props) => {
  const router = useRouter()
  const [currentSectionIndex, setCurrentSectionIndex] = useState(
    data.statistic_entry && data.statistic_entry.length > 0 ? 0 : -1
  )
  const years = data.statistic_entry.map((item: StatisticEntries) => item.year)

  if (currentSectionIndex === -1) {
    return <></>
  }
  return (
    <div className={styles.container}>
      <h1>{getString(router.locale, Strings.EMPLOYNENTS_OF_GRADUATES)}</h1>
      <YearSwitcher
        current={currentSectionIndex}
        onSelect={setCurrentSectionIndex}
        years={years}
        variant={YearSwitcherVariant.WhiteBackground}
      />
      <div className={styles.entriesContainer}>
        {data.statistic_entry[currentSectionIndex]?.single_entry?.map(
          (item: StatisticsSingleEntry) => (
            <StatsEntry
              key={item.title}
              title={item.title}
              value={item.value}
            />
          )
        )}
      </div>
    </div>
  )
}

export default EmploymentStatistics
