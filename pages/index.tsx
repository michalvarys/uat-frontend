import Head from 'next/head'
import { useRouter } from 'next/router'
import ReactResizeDetector from 'react-resize-detector'
import styles from './Home.module.scss'

import { Strings, getString } from 'src/locales'

import Container, { ContainerVariant } from 'src/components/common/Container'
import ImageType from 'src/components/common/types/ImageType'
import { YouTubeVideoWithTextType } from 'src/components/slices/types/YouTubeVideoType'
import NewsType from 'src/components/news/types/NewsType'
import TextWithImageType from 'src/components/slices/types/TextWithImageType'

import HeaderSlice from 'src/components/slices/HeaderSlice'
import YoutubePlayerWithTextSlice from 'src/components/slices/YoutubePlayerWithTextSlice'
import TextWithImageSlice from 'src/components/slices/TextWithImageSlice'
import NewsSlice from 'src/components/slices/NewsSlice'
import FieldOfStudyCarusel from 'src/sections/studies/components/FieldOfStudyCarusel'
import FestivalType from 'src/components/festivals/types/FestivalType'
import FestivalsSlice from 'src/components/slices/FestivalsSlice'
import GalleriesInfoType from 'src/components/slices/types/GalleriesInfoType'
import UATGalleriesSlice from 'src/components/slices/UATGalleriesSlice'
import { GalleryEventType } from 'src/components/galleries/types/GalleryEventType'
import axios from 'axios'
import SocialLinkType from 'src/types/data/SocialLinkType'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { REVALIDATE_TIME } from 'src/constants'
import { chakra } from '@chakra-ui/react'
import { FieldOfStudyType } from 'src/types/fieldsOfStudy'

type HomePageProps = {
  cover_image: ImageType
  logo: ImageType
  festivals: FestivalType[]
  fields_of_studies: FieldOfStudyType[]
  galleries: GalleriesInfoType
  galleryEvents: GalleryEventType[]
  news: NewsType[]
  importantNews: NewsType[]
  subtitle: string
  text_with_image: TextWithImageType[]
  title: string
  video_with_text: YouTubeVideoWithTextType
  social: {
    facebook: SocialLinkType
    instagram: SocialLinkType
    youtube: SocialLinkType
  }
}

export default function Home({
  cover_image,
  logo,
  festivals,
  fields_of_studies,
  galleries,
  galleryEvents,
  news,
  importantNews,
  subtitle,
  text_with_image,
  title,
  video_with_text,
  social,
}: HomePageProps) {
  const router = useRouter()
  const renderTextWithImageSlices = () => {
    if (text_with_image?.length > 1) {
      return (
        <ReactResizeDetector>
          {({ width }) =>
            text_with_image
              .slice(1, text_with_image.length)
              .map((item: TextWithImageType, index: number) => (
                <TextWithImageSlice
                  key={`text-with-image-${item.id}`}
                  data={item}
                  // extraTextTopSpace={index === 0 && width && width > 1300 ? 0 : (index === 0 ? 140 : 0)}
                  // extraTextBottomSpace={index === text_with_image.length - 2 && width && width >1100 ? 200: 0}
                />
              ))
          }
        </ReactResizeDetector>
      )
    }
    return <></>
  }

  return (
    <chakra.div w="full" className={styles.container}>
      <Head>
        <title>{getString(router.locale, Strings.HOME_PAGE_TITLE)}</title>
      </Head>

      <Container variant={ContainerVariant.Black} isHigh>
        {title && subtitle ? (
          <HeaderSlice
            title={title}
            subtitle={subtitle}
            image={cover_image}
            logo={logo}
            news={importantNews}
            facebook={social.facebook}
            instagram={social.instagram}
            youtube={social.youtube}
          />
        ) : (
          <></>
        )}
        <div className={styles.video}>
          {video_with_text ? (
            <YoutubePlayerWithTextSlice data={video_with_text} />
          ) : (
            <></>
          )}
        </div>
        {text_with_image && text_with_image.length > 0 ? (
          <div className={styles.first_text}>
            <ReactResizeDetector>
              {({ width }) => (
                <TextWithImageSlice
                  data={text_with_image[0]}
                  // extraBottomSpace={!width || (width > 800) ? 260 : 0}
                  variant={ContainerVariant.Black}
                />
              )}
            </ReactResizeDetector>
          </div>
        ) : (
          <></>
        )}
        <div className={styles.fields}>
          {fields_of_studies ? (
            <FieldOfStudyCarusel fields={fields_of_studies.filter(Boolean)} />
          ) : (
            <></>
          )}
        </div>
      </Container>
      <Container variant={ContainerVariant.White}>
        {renderTextWithImageSlices()}
      </Container>
      <Container variant={ContainerVariant.Black}>
        <FestivalsSlice
          festivals={festivals?.filter(Boolean)}
          variant={ContainerVariant.Black}
        />
      </Container>
      <Container variant={ContainerVariant.Black}>
        {galleries ? (
          <TextWithImageSlice
            data={{
              title: galleries.title,
              subtitle: galleries.subtitle,
              content: galleries.description,
              image: galleries.image,
              left_side_image: true,
            }}
            variant={ContainerVariant.Black}
          />
        ) : (
          <></>
        )}
      </Container>
      <Container variant={ContainerVariant.White}>
        {galleries ? (
          <UATGalleriesSlice
            galleries={galleries.galleries_uats}
            events={galleryEvents}
          />
        ) : (
          <></>
        )}
      </Container>
      <Container variant={ContainerVariant.Orange}>
        {news ? <NewsSlice news={news} /> : <></>}
      </Container>
    </chakra.div>
  )
}

export async function getStaticProps({
  locale,
  defaultLocale,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<unknown>> {
  const url = `/home-page?_locale=${locale || defaultLocale}`

  try {
    const { data } = await axios(url)
    if (!data) {
      throw new Error('no data')
    }

    return {
      props: data,
      revalidate: REVALIDATE_TIME,
    }
  } catch (e) {
    return {
      props: {},
      revalidate: REVALIDATE_TIME,
    }
  }
}
