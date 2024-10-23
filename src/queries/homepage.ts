import qs from 'qs'
import axios from 'axios'
import { HomeSectionProps } from 'src/sections/homepage/HomeSection'
import { getGalleriesData, getGallery, getGalleryEvents } from './galleries'
import { getNewsData } from './news'

export async function getHomepageData(locale: string) {
  const { data } = await axios(
    `/api/homepage?${qs.stringify({
      locale,
      publicationState: 'live',
      populate: {
        galleries: {
          populate: {
            image: {
              populate: '*',
            },
            galleries_uat: {
              populate: {
                image_424x488: true,
                address: true,
                name: true,
              },
            },
          },
        },
        text_with_image: {
          populate: '*',
        },
        video_with_text: {
          populate: '*',
        },
        fields_of_studies: {
          populate: {
            field_of_study: {
              populate: '*',
            },
          },
        },
        festivals: {
          populate: {
            festival: {
              populate: '*',
            },
          },
        },
        cover_image: true,
        logo: true,
        localizations: {
          populate: '*',
          publicationState: 'live',
        },
      },
    })}`
  )

  const { galleryEvents, ...gallery } = await getGalleriesData(locale)
  const importantNews = await getNewsData(locale, true, 6)
  const news = await getNewsData(locale, false, 24)

  const homepage: HomeSectionProps = {
    ...data,
    news: news,
    importantNews,
    // fields_of_studies: [],
    galleryEvents: galleryEvents.slice(0, 3),
    galleries: {
      ...gallery,
      galleries_uats: data.galleries
        .map((item) => item.galleries_uat)
        .filter(Boolean),
    },
  }

  return homepage
}
