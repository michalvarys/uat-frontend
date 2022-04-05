import Image from 'next/image';

import styles from './ImageButton.module.scss';
import { ImageButtonVariant } from './ImageButtonVariant';

type Props = {
  image: any,
  title: string,
  variant: ImageButtonVariant
}

const getVariantStyle = (variant: ImageButtonVariant): string => {
  switch (variant) {
    case ImageButtonVariant.Black:
      return styles.container_black;
    case ImageButtonVariant.White:
      return styles.container_white;
    default:
      return styles.container_white;
  }
}

const ImageButton = ({ image, title, variant }: Props) => {
  return (
    <div className={`${styles.container} ${getVariantStyle(variant)}`}>
      <span className={styles.title}>{title}</span>
      <Image
        src={image}
        alt="icon"
      />
    </div>
  );
};

ImageButton.defaultProps = {
  variant: ImageButtonVariant.White,
};

export default ImageButton;
