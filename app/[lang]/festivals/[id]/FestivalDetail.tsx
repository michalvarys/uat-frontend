'use client'

import Container, { ContainerVariant } from 'src/components/common/Container'
import FestivalType from 'src/components/festivals/types/FestivalType'
import FestivalWinners from 'src/components/festivals/FestivalWinners'
import FestivalPrizes from 'src/components/festivals/FestivalPrizes'
import TextWithImageSlice from 'src/components/slices/TextWithImageSlice'
import TextWithImageType from 'src/components/slices/types/TextWithImageType'
import ButtonLink, {
  ButtonLinkImageType,
  ButtonLinkVariant,
} from 'src/components/navigation/ButtonLink'
import { DbImage } from 'src/components/DbImage'
import { formatDate } from 'src/utils/date'

import styles from '../festivals.module.scss'

type Props = {
  festival: FestivalType
}

export default function FestivalDetail({ festival }: Props) {
  const { cover_image, content, winners, prizes } = festival

  const renderButtons = (buttons: any[]) => (
    <div className={styles.buttons}>
      {buttons.map((item: any) => (
        <div key={`link-${item.id}`}>
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

  return (
    <>
      <Container variant={ContainerVariant.Black}>
        <div className={styles.top_container}>
          <div className={styles.text_section}>
            <h1 className={styles.header}>{festival.title}</h1>

            <div className={styles.slogan_section}>
              <div className={styles.badge}>
                <div className={styles.symbol}>{festival.symbol}</div>
                <div className={styles.date}>
                  <span>{formatDate(festival.date)}</span>
                </div>
              </div>
              <div className={styles.slogan}>{festival.slogan}</div>
            </div>

            <div className={styles.description}>{festival.description}</div>
            {festival.buttons &&
              festival.buttons.length > 0 &&
              renderButtons(festival.buttons)}
          </div>

          <div className={styles.image}>
            <DbImage
              data={cover_image}
              props={(image) => ({
                width: image.width,
                height: image.height,
                layout: 'responsive',
                objectFit: 'contain',
                objectPosition: 'center center',
              })}
            />
          </div>
        </div>
      </Container>

      <Container variant={ContainerVariant.Transparent} isHigh>
        {prizes && <FestivalPrizes prizes={prizes} />}
      </Container>

      <Container variant={ContainerVariant.White}>
        <div>
          <div>
            {content?.map((item: TextWithImageType, index: number) => (
              <TextWithImageSlice
                key={item.id}
                data={item}
                extraTextTopSpace={index === 0 ? 194 : 0}
              />
            )) || null}
          </div>
        </div>

        <div className={styles.winners_container}>
          {winners?.length > 0 && <FestivalWinners winners={winners} />}
        </div>
      </Container>
    </>
  )
}
