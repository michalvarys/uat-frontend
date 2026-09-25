'use client'

import parse from 'html-react-parser'
import {
  chakra,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Box,
  Stack,
} from '@chakra-ui/react'
import ButtonLink, {
  ButtonLinkImageType,
} from 'src/components/navigation/ButtonLink'
import { useApp } from 'src/components/context/AppContext'
import { getString } from 'src/locales'
import { getAttributes } from '@/utils/data'
import { useCallback } from 'react'
import { CmsContent } from 'src/components/CmsContent'

export function TabsSclice(section) {
  const { currentLanguage } = useApp()
  const { title, description, tabs } = section

  const filteredTabs = tabs?.filter(Boolean) || []

  const renderLinks = useCallback(
    (links) => {
      if (!links?.length) {
        return null
      }

      return (
        <Stack mt={5} direction={{ base: 'column', md: 'row' }} spacing="40px">
          {links.map((linkData) => {
            const link = getAttributes(linkData)

            return (
              <ButtonLink
                key={link.id}
                imageType={ButtonLinkImageType.Arrow}
                title={getString(currentLanguage, 'READ_MORE')}
                // App Router nezná zápis { pathname, query } se zástupným
                // segmentem — ten se vykreslí doslova jako /news/[slug].
                // Slug proto patří rovnou do cesty.
                link={{
                  locale: link.locale,
                  href: `/news/${encodeURIComponent(link.slug)}`,
                }}
              />
            )
          })}
        </Stack>
      )
    },
    [currentLanguage]
  )

  return (
    <chakra.div>
      {title && (
        <Box fontSize="4xl" fontWeight="bolder" textAlign="center" w="full">
          {title}
        </Box>
      )}
      {description && (
        <Box mb={2} fontSize="md" fontWeight="thin" textAlign="center" w="full">
          {description}
        </Box>
      )}

      <Tabs
        variant="solid-rounded"
        border="1px solid"
        borderColor="gray.100"
        borderRadius="md"
        p={4}
        mt={4}
      >
        <TabList>
          {filteredTabs.map(({ title, id }) => (
            <Tab _active={{ color: 'white', bgColor: 'brand.500' }} key={id}>
              {title}
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          {filteredTabs.map(({ id, items }) => (
            <TabPanel key={id}>
              {items?.filter(Boolean).map(({ id, title, content, links }) => (
                <Box
                  key={id}
                  mb={6}
                  sx={{
                    'a:hover': {
                      color: 'uat_orange',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  <Box
                    fontSize="2xl"
                    color="brand.500"
                    fontWeight="regular"
                    textTransform="uppercase"
                    mb={1}
                  >
                    {title}
                  </Box>

                  <Box
                    sx={{
                      p: {
                        display: 'block',
                        overflowWrap: 'break-word',
                        fontSize: {
                          base: 'md',
                          lg: 'sm',
                        },
                        img: {
                          display: 'inline-block',
                          px: '1px',
                        },
                      },
                    }}
                  >
                    {content ? <CmsContent data={content} /> : <p>-</p>}
                  </Box>

                  {renderLinks(links)}
                </Box>
              ))}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </chakra.div>
  )
}
