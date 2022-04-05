import Image from 'next/image';
import Link from 'next/link';

import styles from './BigButton.module.scss';

type Props = {
  image: any,
  title: string,
  path: string,
};

const BigButton = ({ image, path, title }: Props) => (
  // eslint-disable-next-line @next/next/link-passhref
  <Link href={path} as={path}>
    <div className={styles.container}>
      <Image src={image} alt=""/>
      <span className={styles.title}>{title}</span>
    </div>
  </Link>
);

export default BigButton;
