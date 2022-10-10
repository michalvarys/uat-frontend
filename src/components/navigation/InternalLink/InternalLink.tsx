import Link from 'next/link'

import styles from './InternalLink.module.scss'

type Props = {
  children: JSX.Element
  path: string
}

const InternalLink = ({ children, path }: Props) => (
  // eslint-disable-next-line @next/next/link-passhref
  <Link href={path} as={path}>
    <a className={styles.container}>{children}</a>
  </Link>
)

export default InternalLink
