import qs from 'qs'
import axios from 'axios'
export async function getGalleryEvents(locale: string) {
  const { data } = await axios(
    `/api/gallery-events?${qs.stringify({
      locale,
      populate: '*',
      publicationState: 'live',
      sort: {
        date: 'desc',
      },
    })}`
  )

  return data.data.map((item) => item.attributes)
}

export async function getGallery(locale: string) {
  const { data } = await axios(
    `/api/gallery?${qs.stringify({
      locale,
      publicationState: 'live',
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
    })}`
  )

  return data
}

export async function getGalleriesData(locale: string) {
  const gallery = await getGallery(locale)
  const galleryEvents = await getGalleryEvents(locale)

  return {
    ...gallery,
    galleryEvents,
  }
}
