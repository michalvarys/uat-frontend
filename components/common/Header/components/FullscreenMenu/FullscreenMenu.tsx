import Image from 'next/image';
import ReactResizeDetector from 'react-resize-detector';

import InternalLink from '../../../../navigation/InternalLink';
import { MenuSection } from '../../Header';
import HeaderSection from '../HeaderSection';
import styles from './FullscreenMenu.module.scss'

import CloseIconGreen from '../../../../../public/icons/common/close_green.svg';
import CloseIconOrange from '../../../../../public/icons/common/close_orange.svg';
import CloseIconYellow from '../../../../../public/icons/common/close_yellow.svg';
import CloseIconWhite from '../../../../../public/icons/common/close_white.svg';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import LanguageSelector from '../LanguageSelector';

type Props = {
  currentSection: number,
  onChangeSection: Function,
  sectionData: MenuSection,
  sections: Array<MenuSection>,
};

const getIcon = (idx: number) => {
  switch (idx) {
    case 0:
      return CloseIconYellow;
    case 1:
      return CloseIconGreen;
    case 2:
      return CloseIconOrange;
    case 3:
    default:
      return CloseIconWhite; 
  }
}

type MenuItemProps = {
  currentSection: number,
  onChangeSection: Function,
  idx: number,
  title: string,
}

const MenuItem = ({
  currentSection,
  onChangeSection,
  idx,
  title
}: MenuItemProps) => (
  <div
    key={`section-${idx}`}
    onClick={() => onChangeSection(idx)}
    className={classNames({
      [styles.menu_button]: true,
      [styles.menu_button_yellow]: currentSection === 0 && currentSection === idx,
      [styles.menu_button_green]: currentSection === 1 && currentSection === idx,
      [styles.menu_button_orange]: currentSection === 2 && currentSection === idx,
      [styles.menu_button_white]: currentSection === 3 && currentSection === idx,
    })}
  >
    {title}
  </div>
)
const FullscreenMenu = ({ currentSection, onChangeSection, sectionData, sections }: Props) => {
  const router = useRouter();
  const [prevPath, setPrevPath] = useState(router.asPath);

  useEffect(() => {
    if (router.asPath !== prevPath) {
      setPrevPath(router.asPath);
      onChangeSection(-1);
    }
  }, [onChangeSection, router, prevPath]);

  return (
    <div
      className={classNames({
        [styles.container]: true,
        [styles.container_menu_0]: currentSection === 0,
        [styles.container_menu_1]: currentSection === 1,
        [styles.container_menu_2]: currentSection === 2,
        [styles.container_menu_3]: currentSection === 3,
      })}
    >
      <div className={styles.top_container}>
        <div className={styles.left_container}>
          <LanguageSelector isDark />
        </div>
        <div className={styles.right_container}>
          <div
            className={classNames({
              [styles.button_close]: true,
              [styles.button_close_yellow]: currentSection === 0,
              [styles.button_close_green]: currentSection === 1,
              [styles.button_close_orange]: currentSection === 2,
              [styles.button_close_white]: currentSection === 3,
            })}
            onClick={() => onChangeSection(-1)}
          >
            <span>MENU</span>
            <Image
              alt="close"
              src={getIcon(currentSection)} height={17} width={20}/>
          </div>
        </div>
      </div>
        <ReactResizeDetector>
          {({ width }: { width: number }) => {
            if (width > 650) {
              return (
                <div className={styles.menu_main_container}>
                <div className={styles.menu_container}>
                  {sections.map((item: MenuSection, idx: number) => (
                    <MenuItem
                      key={idx}
                      idx={idx}
                      currentSection={currentSection}
                      onChangeSection={onChangeSection}
                      title={item.title}
                    />
                  ))}
                </div>
                </div>
              )
            } else {
              const res: Array<Array<MenuSection>> = sections
                .reduce((acc: Array<Array<MenuSection>>, item: MenuSection, idx: number) => {
                  if (idx % 2 === 0) {
                    return acc.length === 0 ? [[item]] : [...acc, [item]];
                  } else {
                    return acc.length === 1 ? [[...acc[0], item ]]: [acc.slice(0,acc.length-1)[0], [...acc.slice(-1)[0], item]];
                  }
                }, []);
                return (
                  <div className={styles.menu_main_container}>
                    {res.map((row: Array<MenuSection>, idx: number) => (
                    <div className={styles.menu_container} key={idx}>
                      {row.map((item: MenuSection, rowIdx: number) => (
                        <MenuItem
                          key={(idx * 2) + rowIdx}
                          idx={(idx * 2) + rowIdx}
                          currentSection={currentSection}
                          onChangeSection={onChangeSection}
                          title={item.title}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                )
            }
          }}
        </ReactResizeDetector>
      
      <HeaderSection
        data={sectionData}
        sectionIndex={currentSection}
        isMobile
      />
    </div>
  )
}

export default FullscreenMenu;
