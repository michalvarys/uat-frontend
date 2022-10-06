import Image from 'next/image'
import React, { useState } from 'react'
import ReactResizeDetector from 'react-resize-detector'

import HeaderItem from './components/HeaderItem'
import LanguageSelector from './components/LanguageSelector'
import BorderedButton from '../buttons/BorderedButton'

import styles from './Header.module.scss'
import HeaderSection from './components/HeaderSection/HeaderSection'
import LinkType from '../../navigation/types/LinkType'
import Container, { ContainerVariant } from '../Container'
import InternalLink from '../../navigation/InternalLink'
import FullscreenMenu from './components/FullscreenMenu'

import HamburgerIcon from '../../../public/icons/common/hmaburger.svg'

export type MenuSection = {
  links: LinkType[]
  title: string
}

type Props = {
  data: MenuSection[]
}

const Header = ({ data }: Props) => {
  const [openedSection, setOpenedSection] = useState<number>(-1)

  const renderFull = () => (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.left_container}>
          <InternalLink path={'/'}>
            <span>SŠUPAT</span>
          </InternalLink>
        </div>
        <div className={styles.items} onMouseLeave={() => setOpenedSection(-1)}>
          {data &&
            data.map((item, idx) => (
              <HeaderItem
                key={item.title}
                title={item.title}
                currentSection={openedSection}
                idx={idx}
                onOpen={() => setOpenedSection(idx)}
              />
            ))}
          {openedSection > -1 && (
            <div className={styles.menu}>
              <HeaderSection
                data={data[openedSection]}
                sectionIndex={openedSection}
              />
            </div>
          )}
        </div>
        <div className={styles.right_container}>
          <LanguageSelector />
          <div className={styles.divider} />
          <BorderedButton
            title={'EDUPAGE'}
            url={'https://ssuat.edupage.org/login/'}
          />
        </div>
      </div>
    </div>
  )

  const renderWithHamburger = () => (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.left_container}>
          <InternalLink path={'/'}>
            <span>SŠUPAT</span>
          </InternalLink>
        </div>
        <div className={styles.right_container}>
          <div
            className={styles.menu_button}
            onClick={() => setOpenedSection(0)}
          >
            <span>MENU</span>
            <Image alt="close" src={HamburgerIcon} height={17} width={20} />
          </div>
        </div>
        {openedSection > -1 && (
          <FullscreenMenu
            sectionData={data[openedSection]}
            sections={data}
            currentSection={openedSection}
            onChangeSection={setOpenedSection}
          />
        )}
      </div>
    </div>
  )

  return (
    <Container variant={ContainerVariant.Black} isHighest>
      <ReactResizeDetector>
        {({ width }: { width: number }) => {
          if (width > 860) {
            return renderFull()
          } else {
            return renderWithHamburger()
          }
        }}
      </ReactResizeDetector>
    </Container>
  )
}

export default Header
