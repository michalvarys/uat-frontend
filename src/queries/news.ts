import axios from 'axios'
import qs from 'qs'

export async function getNewsByYear(q: Record<string, any>, locale: string) {
  const defaultYear = '' + new Date().getFullYear()
  const { year = defaultYear } = q

  const { data } = await axios(
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
  const { data } = await axios(
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
  const { data } = await axios(
    `/api/news?${qs.stringify({
      filters: {
        slug,
      },
      locale,
      populate: {
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

  return data[0]
}

export async function getNewsByLocales(locales: string[]) {
  const { data } = await axios(
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
