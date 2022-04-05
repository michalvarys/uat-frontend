import Image from 'next/image';
import styles from './404.module.scss';
import { getString, Strings } from '../locales';
import { useRouter } from 'next/router';
import LogoIcon from '../public/icons/common/logo-black.svg';
import ButtonLink, { ButtonLinkImageType } from '../components/navigation/ButtonLink';

import Container, { ContainerVariant } from '../components/common/Container';

export default function NotFountPage() {
  const router = useRouter();
  return (
    <Container variant={ContainerVariant.White}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Image 
            src={LogoIcon} 
            alt="logo" 
            layout={'responsive'}
            objectFit={'cover'}
            objectPosition={'center center'}
          />
        </div>
        <h2>{getString(router.locale, Strings.PAGE_NOT_FOUND)}</h2>
        <ButtonLink
          title={getString(router.locale, Strings.PAGE_NOT_FOUND_BUTTON)}
          path={'/'}
          // variant={ButtonLinkVariant.Black}
          imageType={ButtonLinkImageType.Arrow}
        />
      </div>
    </Container>
  )
}
