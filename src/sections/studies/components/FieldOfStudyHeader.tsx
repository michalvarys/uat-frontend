import Image from 'next/image'

import styles from './FieldOfStudyHeader.module.scss'

import { transformLink } from 'src/utils/link'
import { ContainerVariant } from 'src/components/common/Container'
import ButtonLink, {
  ButtonLinkImageType,
  ButtonLinkVariant,
} from 'src/components/navigation/ButtonLink'
import { FieldOfStudyType } from 'src/types/fieldsOfStudy'
import {
  chakra,
  Flex,
  useBreakpoint,
  useBreakpointValue,
} from '@chakra-ui/react'
import { useMemo } from 'react'

type Props = {
  data: FieldOfStudyType
}

export const FieldOfStudyHeader = ({ data }: Props) => {
  const renderButtons = (buttons: any[]) => {
    return (
      <div className={styles.buttons}>
        {buttons.map((item: any) => (
          <div key={`link-=${item.id}`}>
            <ButtonLink
              imageType={
                item.__component.includes('download')
                  ? ButtonLinkImageType.Download
                  : ButtonLinkImageType.Arrow
              }
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

  const splitLongTitle = useBreakpointValue({ base: false, lg: true })

  const title = useMemo(
    () =>
      splitLongTitle
        ? data.name
            .split(' ')
            .map((word) =>
              word.length > 10
                ? `${word.slice(0, 8)}- ${word.substring(8)}`
                : word
            )
            .join(' ')
        : data.name,
    [data.name, splitLongTitle]
  )

  const renderTextSection = () => (
    <div className={styles.text_section}>
      <chakra.h1
        fontSize={['4xl', '5xl', '7xl', '8xl']}
        lineHeight="100%"
        textTransform="uppercase"
        my={0}
      >
        {title}
      </chakra.h1>

      <div className={styles.code_section}>
        {renderStudyBadge()}
        <span
          className={styles.short_description}
        >{`${data.short_description}`}</span>
      </div>
      <span className={styles.description}>{data.description}</span>
      <div className={styles.buttons}>
        {data.buttons && data.buttons.length > 0 && renderButtons(data.buttons)}
      </div>
    </div>
  )

  const renderImage = () =>
    data.image && (
      <Image
        alt={data.image.alternativeText}
        src={transformLink(data.image.url)}
        width={data.image.width}
        height={data.image.height}
        layout={'responsive'}
        objectFit={'cover'}
        objectPosition={'left top'}
      />
    )

  return (
    <div className={styles.container}>
      <Flex
        className={styles.left}
        justifyContent="center"
        alignItems="center"
        zIndex={2}
        flex="0 1 40%"
        width={{ xs: '100%', lg: '660px' }}
        padding={['60px 20px', '80px 40px', '0 80px 80px']}
      >
        {renderTextSection()}
      </Flex>
      <div className={styles.right}>{renderImage()}</div>
    </div>
  )
}

FieldOfStudyHeader.defaultProps = {
  extraBottomSpace: 0,
  extraTopSpace: 0,
  extraTextTopSpace: 0,
  variant: ContainerVariant.White,
}
