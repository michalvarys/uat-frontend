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

export function TabsSclice(section) {
  const { currentLanguage } = useApp()
  const { title, description, tabs } = section

  const filteredTabs = tabs?.filter(Boolean) || []

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
                <Box key={id} mb={6}>
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
                    {content ? parse(content) : <p>-</p>}
                  </Box>

                  {links?.length ? (
                    <Stack
                      mt={5}
                      direction={{ base: 'column', md: 'row' }}
                      spacing="40px"
                    >
                      {links?.map((link) =>
                        link?.slug ? (
                          <ButtonLink
                            key={link.id}
                            imageType={ButtonLinkImageType.Arrow}
                            title={getString(currentLanguage, 'READ_MORE')}
                            link={{
                              locale: link.locale,
                              href: {
                                pathname: `/news/[slug]`,
                                query: {
                                  slug: link.slug,
                                },
                              },
                            }}
                          />
                        ) : null
                      )}
                    </Stack>
                  ) : null}
                </Box>
              ))}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </chakra.div>
  )
}
