import styles from './Container.module.scss';
import { ContainerVariant } from './ContainerVariant';

type Props = {
  children: JSX.Element | JSX.Element[] | null,
  variant?: ContainerVariant,
  isHigh?: boolean,
  isHighest?: boolean,
};

const getVariantStyle = (variant: ContainerVariant): string => {
  switch (variant) {
    case ContainerVariant.Black:
      return styles.container_black;
    case ContainerVariant.Orange:
      return styles.container_orange;
    case ContainerVariant.White:
      return styles.container_white;
    case ContainerVariant.Transparent:
    default:
      return styles.container_transparent;
  }
}
const Container = ({
  children,
  variant = ContainerVariant.Transparent,
  isHigh = false,
  isHighest = false,
}: Props) => (
  <div className={`${styles.container} ${getVariantStyle(variant)}`}>
    <div className={`${styles.inner_container} ${isHigh ? styles.inner_container_high : ''} ${isHighest ? styles.inner_container_highest : ''}`}>
      {children}
    </div>
  </div>
);

export default Container;
