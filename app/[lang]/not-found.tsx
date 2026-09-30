'use client'

import Image from 'next/image'

import { getString, Strings } from 'src/locales'
import LogoIcon from 'public/icons/common/logo-black.svg'
import ButtonLink, {
  ButtonLinkImageType,
} from 'src/components/navigation/ButtonLink'
import Container, { ContainerVariant } from 'src/components/common/Container'
import { useAppRouter } from 'src/hooks/useAppRouter'

import styles from './404.module.scss'

export default function NotFound() {
  const { locale } = useAppRouter()

  return (
    <Container variant={ContainerVariant.White}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Image
            src={LogoIcon}
            alt="logo"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
              objectPosition: 'center center',
            }}
          />
        </div>
        <h2>{getString(locale, Strings.PAGE_NOT_FOUND)}</h2>
        <ButtonLink
          title={getString(locale, Strings.PAGE_NOT_FOUND_BUTTON)}
          path={'/'}
          imageType={ButtonLinkImageType.Arrow}
        />
      </div>
    </Container>
  )
}
