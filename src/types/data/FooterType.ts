import LinkType from '../../components/navigation/types/LinkType'
import RichTextType from './RichTextType'
import SocialLinkType from './SocialLinkType'

type FooterSectionType = {
  id: number
  links: LinkType[]
  title: string
}

type FooterType = {
  facebook: SocialLinkType
  instagram: SocialLinkType
  youtube: SocialLinkType
  school_address: string
  school_name: string
  contact: RichTextType[]
  footer_sections: FooterSectionType[]
}

export default FooterType
export type { FooterSectionType }
