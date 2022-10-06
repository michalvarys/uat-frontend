import parse from 'html-react-parser'
import Image from 'next/image'

import styles from './EUProjectItem.module.scss'

import EUProjectType from '../../../types/EUProjectType'

import ArrowRightIcon from '../../../../../public/icons/common/arrow_right.svg'

type Props = {
  project: EUProjectType
  onSelect: (item: EUProjectType) => void
}

const EUProjectItem = ({ project, onSelect }: Props) => {
  return (
    <div className={styles.container} onClick={() => onSelect(project)}>
      <div className={styles.content}>
        <span className={styles.title}>{project.title}</span>
        <span className={styles.sneak_peak}>{project.description}</span>
      </div>
      <Image src={ArrowRightIcon} alt={'arrow'} />
    </div>
  )
}

export default EUProjectItem
