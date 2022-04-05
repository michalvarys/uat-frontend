import classNames from 'classnames';
import Link from 'next/link';

import styles from './BorderedButton.module.scss';

type Props = {
  title: string,
  url: string,
  isDark?: boolean,
};

const BorderedButton = ({ title, url, isDark = false }: Props) => (
  // eslint-disable-next-line @next/next/link-passhref
  <Link href={url}>
    <a className={classNames({
      [styles.container]: true,
      [styles.container_dark]: isDark,
    })}>
      <span className={classNames({
        [styles.title]: true,
        [styles.title_dark]: isDark,
      })}
      >
        {title}
      </span>
    </a>
  </Link>
);

export default BorderedButton;
