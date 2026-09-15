import { api } from './client'
import qs from 'qs'

export async function getNewsByYear(q: Record<string, any>, locale: string) {
  const defaultYear = '' + new Date().getFullYear()
  const { year = defaultYear } = q

  const { data } = await api(
    `/api/news-entries?${qs.stringify({
      locale,
      filters: {
        date: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
      populate: {
        sections: {
          populate: '*',
        },
        localizations: {
          populate: '*',
          publicationState: 'live',
        },
      },
      sort: {
        date: 'desc',
      },
      limit: 25,
      offset: 0,
    })}`
  )

  return data
}

export async function getNewsData(
  locale: string,
  important = false,
  limit = 24
) {
  const { data } = await api(
    `/api/news?${qs.stringify({
      locale,
      populate: '*',
      publicationState: 'live',
      filters: important
        ? {
            important_news: true,
          }
        : undefined,
      limit,
      sort: {
        date: 'desc',
      },
    })}`
  )

  return data || []
}

export async function getNewsDetail(slug: string, locale: string) {
  const filters = Number.isNaN(Number(slug)) ? { slug } : { id: Number(slug) }
  const { data } = await api(
    `/api/news?${qs.stringify({
      filters,
      locale,
      populate: {
        seo: {
          populate: '*',
        },
        sections: {
          populate: {
            gallery_item: {
              populate: {
                thumbnail_410x551: {
                  populate: '*',
                },
                fullsize: {
                  populate: '*',
                },
              },
            },
            content: true,
            cover_image: {
              populate: '*',
            },
          },
        },
        localizations: {
          populate: '*',
          publicationState: 'live',
        },
      },
    })}`
  )

  // Když záznam v daném jazyce neexistuje, data[0] je undefined.
  // getStaticProps ho neumí serializovat do JSON a stránka skončí 500,
  // proto se vrací null.
  return data[0] ?? null
}

export async function getNewsByLocales(locales: string[]) {
  const { data } = await api(
    `/api/news?${qs.stringify({
      filters: {
        locale: {
          $in: locales,
        },
      },
    })}`
  )

  return data
}
