import qs from 'qs'
import axios from 'axios'
import { FieldOfStudyType } from 'src/types/fieldsOfStudy'
import { getAttributes } from 'src/utils/data'

export async function getStudyList(
  locales: string[]
): Promise<FieldOfStudyType[]> {
  const { data } = await axios(
    `/api/field-of-studies?${qs.stringify(
      {
        locale: locales,
        populate: '*',
      },
      {
        encodeValuesOnly: true,
      }
    )}`
  )

  return data.data.map((item) => ({ id: item.id, ...item.attributes }))
}

export async function getStudiesData(locale: string) {
  const { data } = await axios(
    `/api/field-of-studies?${qs.stringify(
      {
        locale,
        populate: '*',
      },
      {
        encodeValuesOnly: true,
      }
    )}`
  )

  return data.data.map((item) => ({ id: item.id, ...item.attributes }))
}

export async function getStudyData(
  id: string,
  locale: string
): Promise<FieldOfStudyType | null> {
  const url = `/api/field-of-studies/${id}?${qs.stringify(
    {
      locale,
      populate: {
        galleries: {
          populate: {
            gallery_item: {
              populate: '*',
            },
          },
        },
        teachers: {
          populate: {
            teacher: {
              populate: '*',
            },
          },
        },
        buttons: {
          populate: '*',
        },
        icon_svg: {
          populate: '*',
        },
        image: {
          populate: '*',
        },
        localizations: {
          populate: '*',
        },
        content: {
          populate: {
            sponsor: {
              populate: {
                image: {
                  populate: '*',
                },
              },
            },
            sections: {
              populate: {
                list: {
                  populate: '*',
                },
              },
            },
          },
        },
      },
    },
    {
      encodeValuesOnly: true,
    }
  )}`

  const {
    data: {
      data: { attributes },
    },
  } = await axios(url)

  const study: FieldOfStudyType = {
    ...attributes,
    galleries: attributes.galleries || [],
    icon_svg: getAttributes(attributes.icon_svg),
    image: getAttributes(attributes.image) || null,
    teachers:
      attributes?.teachers
        ?.map((item) => getAttributes(item.teacher))
        .filter(Boolean) || [],
  }

  return study
}
