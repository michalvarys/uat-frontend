import Image from 'next/image';
import parse from 'html-react-parser';

import styles from './FieldOfStudyHeader.module.scss';

import { transformLink } from '../../../utils/transformLink';
import { useRouter } from 'next/router';
import ButtonLink, { ButtonLinkVariant, ButtonLinkImageType } from '../../navigation/ButtonLink';
import { ContainerVariant } from '../../common/Container';
import FieldOfStudyType from '../types/FieldOfStudyType';


type Props = {
  data: FieldOfStudyType,
}

const FieldOfStudyHeader = ({
  data,
}: Props) => {
  const router = useRouter();

  const renderButtons = (buttons: Array<any>) => {
    return (
      <div className={styles.buttons}>
        {buttons.map((item: any) => (
          <div key={`link-=${item.id}`}>
            <ButtonLink
              imageType={item.__component.includes('download') ? ButtonLinkImageType.Download : ButtonLinkImageType.Arrow}
              title={item.title}
              path={item.url || item.path}
              variant={ButtonLinkVariant.Black}
            />
          </div>
        ))}
      </div>
    )
  }

  const renderStudyBadge = () => (
    <div className={styles.badge}>
      <div className={styles.icon}>
        {data.icon_svg && (
          <Image
            alt={data.icon_svg.alternativeText}
            src={transformLink(data.icon_svg.url)}
            width={44}
            height={44}
            layout={'fixed'}
            objectFit={'contain'}
            objectPosition={'center center'}
          />
        )}
      </div>
      <div className={styles.code}>
        <span>{data.code}</span>
      </div>
    </div>
  )

  const renderTextSection = () => (
    <div className={styles.text_section}>
      <h1 className={styles.header}>{data.name}</h1>
      
      <div className={styles.code_section}>
        {renderStudyBadge()}
        <span className={styles.short_description}>{`${data.short_description}`}</span>
      </div>
      <span className={styles.description}>{data.description}</span>
      <div className={styles.buttons}>
        {data.buttons && data.buttons.length > 0 && renderButtons(data.buttons)}
      </div>
    </div>
  );

  const renderImage = () => data.image && (
    <Image
      alt={data.image.alternativeText}
      src={transformLink(data.image.url)}
      width={data.image.width}
      height={data.image.height}
      layout={'responsive'}
      objectFit={'cover'}
      objectPosition={'left top'}
    />
  );

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        {renderTextSection()}
      </div>
      <div className={styles.right}>
      {renderImage()}
      </div>
    </div>
  );
};

FieldOfStudyHeader.defaultProps = {
  extraBottomSpace: 0,
  extraTopSpace: 0,
  extraTextTopSpace: 0,
  variant: ContainerVariant.White,
}

export default FieldOfStudyHeader;
