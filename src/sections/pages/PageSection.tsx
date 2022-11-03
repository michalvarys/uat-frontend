import Container, { ContainerVariant } from 'src/components/common/Container'
import { transformLink } from 'src/utils/link'
import Image from 'next/image'
import PageType from 'src/components/pages/types/PageType'
import { parseSections } from './utils'
import { Section } from './components/Section'
import { chakra, Flex } from '@chakra-ui/react'
import { useMemo } from 'react'

export function PageSection(page: PageType) {
  const sections = useMemo(() => {
    return parseSections(page.sections).filter(Boolean)
  }, [page.sections])

  return (
    <Container variant={ContainerVariant.White}>
      {page?.cover_image && (
        <chakra.div position="relative" w="full" height="300px">
          <Image
            src={transformLink(page.cover_image.url)}
            alt={page.cover_image.alternativeText}
            layout={'fill'}
            objectFit={'cover'}
            objectPosition={'50% 30%'}
          />
        </chakra.div>
      )}

      <Flex flexDirection="column" padding="80px" paddingBottom="200px">
        {page.title && (
          <chakra.h1
            textTransform="uppercase"
            marginLeft="-3px"
            lineHeight="109%"
          >
            {page.title}
          </chakra.h1>
        )}

        {sections.map((section, index) => (
          <Section section={section} key={section?.id || index} />
        ))}
      </Flex>
    </Container>
  )
}
