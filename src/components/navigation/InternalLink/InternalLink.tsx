'use client'

import Link from 'next/link'

import { localePath } from 'src/i18n/config'
import { useAppRouter } from 'src/hooks/useAppRouter'

import styles from './InternalLink.module.scss'

type Props = {
  children: JSX.Element
  path: string
  target?: '_blank' | '_self'
}

/**
 * Odkaz na stránku webu, který drží jazyk aktuální stránky.
 *
 * Bez doplnění prefixu vedly odkazy z anglické verze na slovenské
 * adresy (/about-school místo /en/about-school), takže se návštěvník
 * po prvním kliknutí propadl zpátky do slovenštiny.
 *
 * Cizí adresy a kotvy zůstávají beze změny — jazyk se do nich neplete.
 */
const InternalLink = ({ children, path, target }: Props) => {
  const { locale } = useAppRouter()

  // Soubory z CMS nejsou stránky webu — prefix jazyka by z nich
  // udělal nefunkční adresu.
  const isPage =
    path?.startsWith('/') && !path.startsWith('//') && !path.startsWith('/cms/')

  const href = isPage ? localePath(path, locale) : path

  return (
    <Link href={href} className={styles.container} target={target}>
      {children}
    </Link>
  )
}

export default InternalLink
