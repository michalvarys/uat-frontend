import ButtonLink, {
  ButtonLinkImageType,
  ButtonLinkVariant,
} from 'src/components/navigation/ButtonLink'

type Props = {
  __component: string
  title: string
  path?: string
  url?: string
}
export function HeaderButton({ __component, title, path, url }: Props) {
  return (
    <ButtonLink
      imageType={
        __component.includes('download')
          ? ButtonLinkImageType.Download
          : ButtonLinkImageType.Arrow
      }
      title={title}
      path={url || path}
      variant={ButtonLinkVariant.Black}
    />
  )
}
