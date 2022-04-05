import classNames from 'classnames';
import styles from './LinksSection.module.scss';

import LinkType from '../../../../../navigation/types/LinkType';
import GenericLink from '../../../../../navigation/GenericLink';

type Props = {
  links: Array<LinkType>,
};

const LinksSection = ({ links }: Props) => {
  const rowsAmount = 3;
  const columnAmount = links.length % rowsAmount === 0 ? Math.floor(links.length / rowsAmount) : Math.floor(links.length / rowsAmount) + 1;

  const data = [];
  for (let i = 0 ; i < columnAmount ; i++) {
    data.push(links.slice(i * rowsAmount, (i + 1) * rowsAmount));
  }
  
  return (
    <div className={styles.container}>
      {data.map((linksSet: Array<LinkType>, idx: number) => (
        <div className={styles.column} key={`column-${idx}`}>
          {linksSet.map((item: LinkType) => (
            <div className={styles.link_container} key={item.id}>
              <GenericLink data={item}>
                <span className={styles.link}>{item.title}</span>
              </GenericLink>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default LinksSection;
