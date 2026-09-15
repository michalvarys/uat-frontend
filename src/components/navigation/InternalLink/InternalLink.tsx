import Link from 'next/link'

import styles from './InternalLink.module.scss'

type Props = {
  children: JSX.Element
  path: string
  target?: '_blank' | '_self'
}

const InternalLink = ({ children, path, target }: Props) => (
  <Link href={path} className={styles.container} target={target}>
    {children}
  </Link>
)

export default InternalLink
