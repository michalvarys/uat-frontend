import LinkType from '../../components/navigation/types/LinkType';
import RichTextType from './RichTextType';
import SocialLinkType from './SocialLinkType';

type FooterSectionType = {
  id: number,
  links: Array<LinkType>,
  title: string,
}

type FooterType = {
  facebook: SocialLinkType,
  instagram: SocialLinkType,
  youtube: SocialLinkType,
  school_address: string,
  school_name: string,
  contact: Array<RichTextType>,
  footer_sections: Array<FooterSectionType>,
}

export default FooterType;
export type { FooterSectionType };