import { chakra, Flex } from '@chakra-ui/react'
import { useMemo } from 'react'
import Container, { ContainerVariant } from 'src/components/common/Container'
import ImageType from 'src/components/common/types/ImageType'
import { FestivalRelationship } from 'src/components/festivals/types/FestivalType'
import { GalleryEventType } from 'src/components/galleries/types/GalleryEventType'
import NewsType from 'src/components/news/types/NewsType'
import FestivalsSlice from 'src/components/slices/FestivalsSlice'
import HeaderSlice from 'src/sections/homepage/components/HeaderSlice'
import NewsSlice from 'src/components/slices/NewsSlice'
import TextWithImageSlice from 'src/components/slices/TextWithImageSlice'
import GalleriesInfoType from 'src/components/slices/types/GalleriesInfoType'
import TextWithImageType from 'src/components/slices/types/TextWithImageType'
import { YouTubeVideoWithTextType } from 'src/components/slices/types/YouTubeVideoType'
import UATGalleriesSlice from 'src/components/slices/UATGalleriesSlice'
import YoutubePlayerWithTextSlice from 'src/components/slices/YoutubePlayerWithTextSlice'
import SocialLinkType from 'src/types/data/SocialLinkType'
import { FieldOfStudyRelationshipData } from 'src/types/fieldsOfStudy'
import FieldOfStudyCarusel from '../studies/components/FieldOfStudyCarusel'
import { prepareFestivals } from 'src/components/slices/FestivalsSlice/components/FestivalsGrid'

export type HomeSectionProps = {
  cover_image: ImageType
  logo: ImageType
  festivals: FestivalRelationship[]
  fields_of_studies: FieldOfStudyRelationshipData[]
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

export function HomeSection(props: HomeSectionProps) {
  const {
    news = [],
    cover_image,
    logo,
    festivals,
    fields_of_studies,
    galleries,
    galleryEvents,
    importantNews,
    subtitle,
    text_with_image,
    title,
    video_with_text,
    social,
  } = props

  const renderTextWithImageSlices = useMemo(() => {
    if (!text_with_image?.length) {
      return null
    }

    return (
      <Container variant={ContainerVariant.White}>
        {text_with_image.slice(1).map((item) => (
          <TextWithImageSlice key={`text-with-image-${item.id}`} data={item} />
        ))}
      </Container>
    )
  }, [text_with_image])

  return (
    <Flex flexDir="column" gap={2}>
      <Container variant={ContainerVariant.Black} isHigh>
        {title && subtitle && (
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
        )}

        <chakra.div
          p={{ base: '0 20px 0', sm: '10px 20px', md: '40px', lg: '80px' }}
          mb={{ base: 0, lg: '80px' }}
        >
          {video_with_text && (
            <YoutubePlayerWithTextSlice data={video_with_text} />
          )}
        </chakra.div>

        {text_with_image?.length && (
          <chakra.div mt={{ base: '20px', lg: '-80px' }}>
            <TextWithImageSlice
              data={text_with_image[0]}
              variant={ContainerVariant.Black}
            />
          </chakra.div>
        )}

        {fields_of_studies && (
          <chakra.div
            py={0}
            px={{ base: '20px', md: '40px', lg: '80px' }}
            zIndex={99}
            mb={0}
            display={{ base: 'flex', md: 'block' }}
            justifyContent="center"
          >
            <FieldOfStudyCarusel
              fields={fields_of_studies
                .map((item) => item?.field_of_study)
                .filter(Boolean)}
            />
          </chakra.div>
        )}
      </Container>

      {renderTextWithImageSlices}

      <Container variant={ContainerVariant.Black}>
        <FestivalsSlice
          festivals={prepareFestivals(festivals?.filter(Boolean))}
          variant={ContainerVariant.Black}
        />
      </Container>

      <Container variant={ContainerVariant.Black}>
        {galleries && (
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
        )}
      </Container>

      <Container variant={ContainerVariant.White}>
        {galleries && (
          <UATGalleriesSlice
            galleries={galleries.galleries_uats}
            events={galleryEvents}
          />
        )}
      </Container>

      <Container variant={ContainerVariant.Orange}>
        <NewsSlice news={news} />
      </Container>
    </Flex>
  )
}
