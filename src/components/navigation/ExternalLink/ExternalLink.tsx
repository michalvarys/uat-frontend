import Link from 'next/link'

import styles from './ExternalLink.module.scss'

type Props = {
  children: JSX.Element
  url: string
}

const ExternalLink = ({ children, url }: Props) => (
  <Link href={url} className={styles.container}>
    {children}
  </Link>
)

export default ExternalLink
