import qs from 'qs'
import axios from 'axios'

export async function getDocumentList() {
  const { data } = await axios(
    `/api/upload/files?${qs.stringify({
      sort: 'createdAt:DESC',
      filters: {
        $and: [
          {
            mime: {
              $notContains: {
                $in: ['image', 'video'],
              },
            },
          },
        ],
      },
    })}`
  )

  const extensions = [
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.pdf',
    '.pages',
    '.numbers',
    '.keynote',
    '.ppt',
    '.pptx',
  ]

  return data.filter((item) => extensions.includes(item.ext)) || []
}
