import axios from 'axios'
import qs from 'qs'

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
