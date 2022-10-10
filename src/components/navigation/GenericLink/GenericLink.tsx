import ExternalLink from '../ExternalLink'
import InternalLink from '../InternalLink'
import LinkType from '../types/LinkType'

type Props = {
  children: JSX.Element
  data: LinkType
}

const GenericLink = ({ children, data }: Props) => {
  switch (data.__component) {
    case 'navigation.internal-link':
      return (
        <InternalLink key={data.id} path={data.path || ''}>
          {children}
        </InternalLink>
      )
    case 'navigation.external-link':
      return (
        <ExternalLink key={data.id} url={data.url || ''}>
          {children}
        </ExternalLink>
      )
    default:
      return <div>UNKNOWN_COMPONENT</div>
  }
}

export default GenericLink
