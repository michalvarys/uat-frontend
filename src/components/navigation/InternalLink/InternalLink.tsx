import Link from 'next/link'

import styles from './InternalLink.module.scss'

type Props = {
  children: JSX.Element
  path: string
  target?: '_blank' | '_self'
}

const InternalLink = ({ children, path, target }: Props) => (
  // eslint-disable-next-line @next/next/link-passhref
  <Link href={path} as={path}>
    <a className={styles.container} target={target}>
      {children}
    </a>
  </Link>
)

export default InternalLink
