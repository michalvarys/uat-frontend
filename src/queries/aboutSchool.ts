import qs from 'qs'
import { api } from './client'
import AboutSchoolType from '@/components/aboutSchool/types/AboutSchoolType'

export async function getAboutSchoolDetail(
  locale: string
): Promise<AboutSchoolType> {
  const { data } = await api(
    `/api/about-school?${qs.stringify({
      locale,
      populate: {
        seo: {
          populate: '*',
        },
        applications_at_university: {
          populate: {
            sections: {
              populate: '*',
            },
          },
        },

        eu_projects: {
          populate: '*',
        },

        employment_statistics: {
          populate: {
            statistic_entry: {
              populate: '*',
            },
          },
        },

        buttons: {
          populate: '*',
        },

        video: {
          populate: {
            cover_image: true,
            youtube_video_id: true,
          },
        },
      },
      publicationState: 'live',
    })}`
  )

  const { id, attributes } = data.data
  return { ...attributes, id }
}
