import PageType from '@/components/pages/types/PageType'
import axios from 'axios'
import qs from 'qs'

export async function getPagesData(locales: string[]): Promise<PageType[]> {
  const { data } = await axios(
    `/api/pages?${qs.stringify({
      locale: locales,
      populate: '*',
    })}`
  )

  return data.data || []
}

export async function getPageDetail(slug: string, locale: string) {
  const { data } = await axios(
    `/api/pages?${qs.stringify({
      filters: { slug },
      locale,
      populate: {
        localizations: {
          populate: '*',
        },
        sections: {
          populate: {
            sections: {
              populate: '*',
            },
            links: {
              populate: {
                internalLink: {
                  populate: '*',
                },
                externalLink: {
                  populate: '*',
                },
              },
            },
            cover_image: true,
            gallery_item: {
              populate: '*',
            },
            content: true,
            tabs: {
              populate: {
                content: true,
                title: true,
                items: {
                  populate: {
                    title: true,
                    links: {
                      populate: '*',
                    },
                  },
                },
              },
            },
            teachers: {
              populate: '*',
            },
            CardItem: {
              populate: '*',
            },
          },
        },
        cover_image: true,
      },
    })}`
  )

  return data.data[0]
}
