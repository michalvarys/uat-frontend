import Image from 'next/image'
import React, { useMemo, useState } from 'react'
import { chakra, Flex } from '@chakra-ui/react'

import HamburgerIcon from 'public/icons/common/hmaburger.svg'
import { EDUPAGE_URL, SCHOOL_SHORT_TITLE, EDUPAGE_TITLE } from 'src/constants'

import BorderedButton from '../buttons/BorderedButton'
import LinkType from '../../navigation/types/LinkType'
import Container, { ContainerVariant } from '../Container'
import InternalLink from '../../navigation/InternalLink'

import HeaderSection from './components/HeaderSection/HeaderSection'
import FullscreenMenu from './components/FullscreenMenu'
import HeaderItem from './components/HeaderItem'
import LanguageSelector from './components/LanguageSelector'

import styles from './Header.module.scss'

export type MenuSection = {
  links: LinkType[]
  title: string
}

type Props = {
  data: MenuSection[]
}

const Header = ({ data }: Props) => {
  const [openedSection, setOpenedSection] = useState<number>(-1)

  const desktopMenu = useMemo(
    () => (
      <chakra.div
        display={{ base: 'none', md: 'block' }}
        className={styles.container}
      >
        <Flex
          className={styles.header}
          justify="space-between"
          alignItems="center"
          padding={{ base: '48px', md: '82px' }}
        >
          <div className={styles.left_container}>
            <InternalLink path={'/'}>
              <span>{SCHOOL_SHORT_TITLE}</span>
            </InternalLink>
          </div>

          <div
            className={styles.items}
            onMouseLeave={() => setOpenedSection(-1)}
          >
            {data?.map((item, idx) => (
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
            <BorderedButton title={EDUPAGE_TITLE} url={EDUPAGE_URL} />
          </div>
        </Flex>
      </chakra.div>
    ),
    [data, openedSection]
  )

  const mobileMenu = useMemo(
    () => (
      <chakra.div
        display={{ base: 'block', md: 'none' }}
        className={styles.container}
      >
        <div className={styles.header}>
          <div className={styles.left_container}>
            <InternalLink path={'/'}>
              <span>{SCHOOL_SHORT_TITLE}</span>
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
      </chakra.div>
    ),
    [data, openedSection]
  )

  return (
    <Container variant={ContainerVariant.Black} isHighest>
      {mobileMenu}
      {desktopMenu}
    </Container>
  )
}

export default Header
