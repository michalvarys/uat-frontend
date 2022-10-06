import Link from 'next/link'

import styles from './ExternalLink.module.scss'

type Props = {
  children: JSX.Element
  url: string
}

const ExternalLink = ({ children, url }: Props) => (
  // eslint-disable-next-line @next/next/link-passhref
  <Link href={url}>
    <a className={styles.container}>{children}</a>
  </Link>
)

export default ExternalLink
