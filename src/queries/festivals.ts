import qs from 'qs'
import axios from 'axios'
import FestivalType from '@/components/festivals/types/FestivalType'

export async function getFestivalList(
  locales: string[]
): Promise<FestivalType[]> {
  const { data } = await axios(
    `/api/festivals?${qs.stringify({
      locale: locales,
    })}`
  )

  return data.data.map((item) => ({ id: item.id, ...item.attributes })) || []
}

export async function getFestivalDetail(id: string, locale: string) {
  const url = `/api/festivals/${id}?${qs.stringify({
    locale,
    populate: {
      winners: {
        populate: {
          single_winner: {
            populate: '*',
          },
        },
      },
      buttons: {
        populate: '*',
      },
      prizes: {
        populate: '*',
      },
      content: {
        populate: {
          image: {
            populate: '*',
          },
          download_link: {
            populate: '*',
          },
          link: {
            populate: '*',
          },
          sponsor: {
            populate: {
              image: {
                populate: '*',
              },
            },
          },
          sections: {
            populate: {
              list: {
                populate: '*',
              },
            },
          },
        },
      },

      image: {
        populate: '*',
      },

      cover_image: {
        populate: '*',
      },

      thumbnail: {
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

  console.log(attributes)

  return attributes
}
