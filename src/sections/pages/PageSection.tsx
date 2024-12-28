import Container, { ContainerVariant } from 'src/components/common/Container'
import PageType from 'src/components/pages/types/PageType'
import { parseSections } from './utils'
import { Section } from './components/Section'
import { chakra, Flex, Heading, Text } from '@chakra-ui/react'
import { useMemo } from 'react'
import { DbImage } from 'src/components/DbImage'

export function PageSection(page: PageType) {
  const sections = useMemo(() => {
    return parseSections(page.attributes.sections).filter(Boolean)
  }, [page.attributes.sections])

  const hasCover =
    page.attributes.cover_image &&
    'data' in page.attributes.cover_image &&
    page.attributes.cover_image.data

  return (
    <Container variant={ContainerVariant.White}>
      {hasCover && (
        <chakra.div position="relative" w="full" height="300px">
          <DbImage
            data={page.attributes.cover_image}
            props={{
              layout: 'fill',
              objectFit: 'cover',
              objectPosition: '50% 30%',
            }}
          />
        </chakra.div>
      )}

      <Flex
        p={{ base: 2, md: '80px' }}
        pt={{ base: 4, md: '80px' }}
        pb={{ base: 2, md: '200px' }}
        flexDirection="column"
      >
        {page.attributes.title && (
          <Heading
            lineHeight={1.1}
            fontWeight={600}
            fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}
            ml="-8px"
            mb="28px"
          >
            <Text
              as={'span'}
              position={'relative'}
              _after={{
                // eslint-disable-next-line quotes
                content: "''",
                width: 'full',
                height: '30%',
                position: 'absolute',
                bottom: 1,
                left: 0,
                bg: 'orange.500',
                zIndex: -1,
              }}
            >
              {page.attributes.title}
            </Text>
          </Heading>
        )}

        {sections.map((section, index) => (
          <Section section={section} index={index} key={section?.id || index} />
        ))}
      </Flex>
    </Container>
  )
}
