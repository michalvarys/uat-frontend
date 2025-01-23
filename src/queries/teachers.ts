import qs from 'qs'
import axios from 'axios'

export async function getTeachersData(locale: string) {
  const { data } = await axios(
    `/api/teachers?${qs.stringify(
      {
        locale,
        populate: '*',
        pagination: {
          page: 1,
          pageSize: 1000,
        },
      },
      {
        encodeValuesOnly: true,
      }
    )}`
  )

  const teachers = data.data.map((item) => ({
    ...item.attributes,
    id: item.id,
  }))

  return teachers
}
