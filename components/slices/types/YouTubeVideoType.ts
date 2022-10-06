import ImageType from '../../common/types/ImageType'
import LinkType from '../../navigation/types/LinkType'

type YouTubeVideoType = {
  id: string
  title?: string
  youtube_video_id: string
  cover_image: ImageType
}

type YouTubeVideoWithTextType = YouTubeVideoType & {
  content: string
  link: LinkType
  download_link: LinkType
}

export default YouTubeVideoType
export type { YouTubeVideoWithTextType }
