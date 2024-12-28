import qs from 'qs'
import axios from 'axios'
import { GalleryEventType } from '@/components/galleries/types/GalleryEventType'

export async function getEventList(
  locales: string[]
): Promise<GalleryEventType[]> {
  const url = `/api/gallery-events?${qs.stringify({
    locale: locales,
  })}`

  const { data } = await axios(url)
  return data.data.map((item) => ({ id: item.id, ...item.attributes }))
}

export async function getEventDetail(id: string, locale: string) {
  const url = `/api/gallery-events/${id}?${qs.stringify({
    locale,
    populate: {
      gallery: {
        populate: {
          gallery_item: {
            populate: '*',
          },
        },
      },

      image: {
        populate: '*',
      },

      cover_image: {
        populate: '*',
      },

      localizations: {
        populate: '*',
      },
    },
  })}`

  const {
    data: {
      data: { attributes },
    },
  } = await axios(url)

  return { ...attributes, id }
}
