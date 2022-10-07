import { useState } from 'react'
import EUProjectType from '../types/EUProjectType'
import EUProjectItem from './components/EUProjectItem'

import styles from './EUProjectsList.module.scss'

type Props = {
  projects: EUProjectType[]
  onSelect: (item: EUProjectType) => void
}

const EUProjectsList = ({ projects = [], onSelect }: Props) => {
  return (
    <div className={styles.container}>
      {projects.map((item: EUProjectType, idx: number) => (
        <EUProjectItem
          project={item}
          key={`${item.title}-${idx}`}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

export default EUProjectsList
