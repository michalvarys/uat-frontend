import qs from 'qs'
import axios from 'axios'

export async function getTeachersData(locale: string) {
  const { data } = await axios(
    `/api/teachers?${qs.stringify(
      {
        locale,
        populate: '*',
      },
      {
        encodeValuesOnly: true,
      }
    )}`
  )
  const teachers = data.data.map((item) => item.attributes)
  return teachers
}
