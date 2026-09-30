import qs from 'qs'
import { api } from './client'
import { GalleryEventType } from '@/components/galleries/types/GalleryEventType'

export async function getEventList(
  locales: string[]
): Promise<GalleryEventType[]> {
  const url = `/api/gallery-events?${qs.stringify({
    locale: locales,
  })}`

  const { data } = await api(url)
  return data.data.map((item) => ({ id: item.id, ...item.attributes }))
}

export async function getEventDetail(id: string, locale: string) {
  const url = `/api/gallery-events/${id}?${qs.stringify({
    locale,
    populate: {
      seo: {
        populate: '*',
      },
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
  } = await api(url)

  return { ...attributes, id }
}
