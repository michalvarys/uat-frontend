import PageType from '@/components/pages/types/PageType'
import { api } from './client'
import qs from 'qs'

export async function getPagesData(locales: string[]): Promise<PageType[]> {
  const { data } = await api(
    `/api/pages?${qs.stringify({
      locale: locales,
      populate: '*',
      // Bez tohoto filtru API vrací i rozepsané koncepty. Ty se pak
      // předgenerují a jsou veřejně dostupné, přestože redaktor je
      // nepublikoval.
      publicationState: 'live',
    })}`
  )

  return data
}

export async function getPageDetail(slug: string, locale: string) {
  const filters = Number.isNaN(Number(slug)) ? { slug } : { id: Number(slug) }
  const { data } = await api(
    `/api/pages?${qs.stringify({
      filters,
      locale,
      publicationState: 'live',
      populate: {
        seo: {
          populate: '*',
        },
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
                  populate: '*',
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
  return data[0]
}
