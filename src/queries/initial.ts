import qs from 'qs'
import axios from 'axios'

export async function getInitialPropsData(locale: string) {
  const { data } = await axios(
    `/api/global?${qs.stringify({
      locale,
    })}`
  )
  return data
}
