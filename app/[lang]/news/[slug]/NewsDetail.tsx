'use client'

import RichTextSlice from 'src/components/slices/RichTextSlice'
import GallerySlice from 'src/components/slices/GallerySlice'
import YoutubePlayerSlice from 'src/components/slices/YoutubePlayerSlice'
import ButtonLink, {
  ButtonLinkImageType,
} from 'src/components/navigation/ButtonLink'
import Container, { ContainerVariant } from 'src/components/common/Container'
import NewsType from 'src/components/news/types/NewsType'

import styles from '../news.module.scss'

type Props = {
  news: NewsType
}

function renderSection(section: any, styles: Record<string, string>) {
  switch (section.__component) {
    case 'shared.rich-text-with-title':
      return (
        <div
          key={`section-rich-text-${section.id}`}
          className={styles.rich_text}
        >
          <RichTextSlice data={section} />
        </div>
      )
    case 'shared.you-tube-player-slice':
      return (
        <div className={styles.player} key={`section-youtube-${section.id}`}>
          <YoutubePlayerSlice data={section} />
        </div>
      )
    case 'shared.gallery':
      return (
        <div className={styles.gallery} key={`section-gallery-${section.id}`}>
          <GallerySlice data={section} />
        </div>
      )
    case 'navigation.section':
      return (
        <div
          className={styles.navigation}
          key={`section-nav-${section.items[0]?.id}`}
        >
          {section.items.map((item: any) => (
            <div key={`link-${item.id}`}>
              <ButtonLink
                imageType={
                  item.__component.includes('download')
                    ? ButtonLinkImageType.Download
                    : ButtonLinkImageType.Arrow
                }
                title={item.title}
                path={item.url || item.path}
              />
            </div>
          ))}
        </div>
      )
    default:
      return null
  }
}

export default function NewsDetail({ news }: Props) {
  // Sousedící odkazy se slučují do jedné navigační sekce, aby se
  // vykreslily vedle sebe a ne každý na vlastním řádku.
  const sections = news.sections.reduce((acc: any[], item: any) => {
    if (item.__component.includes('navigation')) {
      const last = acc[acc.length - 1]
      if (last?.__component.includes('navigation')) {
        acc[acc.length - 1] = { ...last, items: [...last.items, item] }
        return acc
      }
      return [...acc, { __component: 'navigation.section', items: [item] }]
    }
    return [...acc, item]
  }, [])

  return (
    <Container variant={ContainerVariant.White}>
      <div className={styles.details_container}>
        <div className={styles.title}>
          <h1 className={styles.header}>{news.title}</h1>
        </div>
        {sections.map((item: any) => renderSection(item, styles))}
      </div>
    </Container>
  )
}
