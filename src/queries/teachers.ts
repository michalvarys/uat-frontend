import qs from 'qs'
import { api } from './client'

export async function getTeachersData(locale: string) {
  const { data } = await api(
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
