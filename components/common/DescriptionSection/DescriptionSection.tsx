import parse from 'html-react-parser'
import classNames from 'classnames';

import styles from './DescriptionSection.module.scss';

import DescriptionType from '../types/DescriptionType';
import ButtonLink, { ButtonLinkImageType, ButtonLinkVariant } from '../../navigation/ButtonLink';
import { ContainerVariant } from '../Container';

type Props = {
  data: DescriptionType,
  isGreen?: boolean,
  variant: ContainerVariant,
}

const DescriptionSection = ({ data, isGreen, variant }: Props) => {
  return (
    <div className={styles.container}>
      {data.title && (
        <h2 className={styles.title}>{data.title}</h2>
      )}
      <span
        className={
          classNames({
            [styles.subtitle]: true,
            [styles.subtitle_green]: isGreen,
          })
        }
      >
        {data.subtitle}
      </span>
      <span className={styles.content}>{parse(data.content)}</span>
      <div className={styles.links}>
        {data.download_link && (
          <ButtonLink
            title={data.download_link.title}
            path={data.download_link.path || data.download_link.url || ''}
            variant={variant === ContainerVariant.Black ? ButtonLinkVariant.Black : ButtonLinkVariant.White}
            imageType={ButtonLinkImageType.Download}
          />
        )}
        {data.link && (
          <ButtonLink
            title={data.link.title}
            path={data.link.path || data.link.url || ''}
            variant={variant === ContainerVariant.Black ? ButtonLinkVariant.Black : ButtonLinkVariant.White}
            imageType={ButtonLinkImageType.Arrow}
          />
        )}
      </div>
    </div>
  );
};

DescriptionSection.defaultProps = {
  isGreen: false,
}

export default DescriptionSection;
