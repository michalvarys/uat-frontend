import qs from 'qs'
import { api } from './client'

export async function getInitialPropsData(locale: string) {
  const { data } = await api(
    `/api/global?${qs.stringify({
      locale,
    })}`
  )

  return data
}
