import { chakra } from '@chakra-ui/react'
import ButtonLink, {
  ButtonLinkImageType,
} from 'src/components/navigation/ButtonLink'
import GallerySlice from 'src/components/slices/GallerySlice'
import RichTextSlice from 'src/components/slices/RichTextSlice'
import { TabsSclice } from 'src/components/slices/TabsSlice'
import YoutubePlayerSlice from 'src/components/slices/YoutubePlayerSlice'
import TeachersCarusel from 'src/components/teachers/TeachersCarusel'

export function Section({ section }) {
  switch (section.__component) {
    case 'shared.rich-text-with-title':
      return (
        <chakra.div
          lineHeight="30px"
          pt="28px"
          pb="104px"
          key={`section-rich-text-${section.id}`}
        >
          <RichTextSlice data={section} />
        </chakra.div>
      )

    case 'shared.you-tube-player-slice':
      return (
        <chakra.div pb="104px" key={`section-youtube-${section.id}`}>
          <YoutubePlayerSlice data={section} />
        </chakra.div>
      )

    case 'shared.gallery':
      return (
        <chakra.div pb="104px" key={`section-gallery-${section.id}`}>
          <GallerySlice data={section} />
        </chakra.div>
      )

    case 'navigation.section':
      return (
        <chakra.div
          mt="-80px"
          pb="104px"
          display="flex"
          flexWrap="wrap"
          w="full"
          gap="20px"
        >
          {section.items.map((item) => (
            <div key={`link-=${item.id}`}>
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
        </chakra.div>
      )

    case 'shared.teachers-slice':
      return (
        <chakra.div mx="-80px" pb="240px">
          <TeachersCarusel teachers={section.teachers} isTitle={false} />
        </chakra.div>
      )
    case 'shared.tabs': {
      return (
        <>
          <TabsSclice {...section} />
        </>
      )
    }
  }

  return null
}
