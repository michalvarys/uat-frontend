import Image from 'next/image'
import Head from 'next/head'
import moment from 'moment'

import styles from './festivals.module.scss'

import Container, { ContainerVariant } from 'src/components/common/Container'
import FestivalType from 'src/components/festivals/types/FestivalType'
import axios from 'axios'
import { REVALIDATE_TIME } from 'src/constants'
import { transformLink } from 'src/utils/link'
import TextWithImageSlice from 'src/components/slices/TextWithImageSlice'
import TextWithImageType from 'src/components/slices/types/TextWithImageType'
import FestivalWinners from 'src/components/festivals/FestivalWinners'
import FestivalPrizes from 'src/components/festivals/FestivalPrizes/FestivalPrizes'
import ButtonLink, {
  ButtonLinkImageType,
  ButtonLinkVariant,
} from 'src/components/navigation/ButtonLink'
import { useApp } from 'src/components/context/AppContext'
import { useEffect } from 'react'
import { setLocalizationData } from 'src/utils/localizationsUtils'
import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import { localesToParams } from 'src/utils/params'

type FestivalsProps = {
  festival: FestivalType
}

export default function Festival({ festival }: FestivalsProps) {
  const { cover_image, content, winners, prizes, title } = festival
  const { setLocalePaths } = useApp()

  useEffect(() => {
    if (festival && festival.localizations.length > 0) {
      setLocalizationData(setLocalePaths, festival.localizations, '/festivals')
    } else {
      setLocalizationData(setLocalePaths, null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [festival])

  if (!festival) {
    return <></>
  }

  const renderStudyBadge = () => (
    <div className={styles.badge}>
      <div className={styles.symbol}>{festival.symbol}</div>
      <div className={styles.date}>
        <span>{moment(festival.date).format('DD MMM YYYY')}</span>
      </div>
    </div>
  )

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

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Container variant={ContainerVariant.Black}>
        <div className={styles.top_container}>
          <div className={styles.text_section}>
            <h1 className={styles.header}>{festival.title}</h1>

            <div className={styles.slogan_section}>
              {renderStudyBadge()}
              <div className={styles.slogan}>{festival.slogan}</div>
            </div>

            <div className={styles.description}>{festival.description}</div>
            {festival.buttons &&
              festival.buttons.length > 0 &&
              renderButtons(festival.buttons)}
          </div>

          <div className={styles.image}>
            {cover_image ? (
              <Image
                alt={cover_image.alternativeText}
                src={transformLink(cover_image.url)}
                width={cover_image.width}
                height={cover_image.height}
                layout={'responsive'}
                objectFit={'contain'}
                objectPosition={'center center'}
              />
            ) : (
              <></>
            )}
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
            )) || <></>}
          </div>
        </div>

        <div className={styles.winners_container}>
          {winners?.length > 0 && <FestivalWinners winners={winners} />}
        </div>
      </Container>
    </>
  )
}

type Params = {
  id: string
}

export async function getStaticPaths({
  locales,
}: GetStaticPathsContext): Promise<GetStaticPathsResult<Params>> {
  const params = localesToParams(locales)
  const url = `/cms/festivals?${params}`

  try {
    const { data: festivals } = await axios.get<FestivalType[]>(url)

    return {
      paths: festivals.map((item) => ({
        params: {
          id: item.id.toString(),
        },
      })),
      fallback: 'blocking',
    }
  } catch (e) {
    return {
      paths: [],
      fallback: 'blocking',
    }
  }
}

export async function getStaticProps({
  locale,
  params,
}: GetStaticPropsContext<Params>): Promise<
  GetStaticPropsResult<FestivalsProps>
> {
  const url = `/festivals/${params!.id}?_locale=${locale}`

  try {
    const { data: festival } = await axios.get<FestivalType>(url)

    if (!festival) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        festival,
      },
      revalidate: REVALIDATE_TIME,
    }
  } catch (e) {
    return {
      redirect: {
        destination: '/500',
        permanent: false,
      },
      revalidate: REVALIDATE_TIME,
    }
  }
}
