import {
  Heading,
  Text,
  Stack,
  Tr,
  Td,
  Table,
  Tbody,
  UnorderedList,
  OrderedList,
  ListItem,
  Box,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react'
import parse, {
  domToReact,
  DOMNode,
  attributesToProps,
} from 'html-react-parser'
import RichTextType from '../../../types/data/RichTextType'
import styles from './RichTextSlice.module.scss'
import InternalLink from '@/components/navigation/InternalLink'
import ExternalLink from '@/components/navigation/ExternalLink'
import ButtonLink from '@/components/navigation/ButtonLink'
import { AccordionView, HTMLCodeBlockView } from '@ssupat/components'

type Props = {
  data: RichTextType
}

function renderJSON(content: any[]) {
  return content.map((item) => {
    const { attrs, content, type, text } = item
    try {
      switch (type) {
        case 'text':
          return text

        case 'paragraph':
          return renderJSON(content)

        case 'htmlCodeBlock':
          return <HTMLCodeBlockView {...attrs} props={{ mt: 8 }} />

        case 'heading': {
          const { level, ...props } = attrs as {
            level: 1 | 2 | 3 | 4
            textAlign: 'left' | 'right' | 'center'
          }

          return (
            <Heading {...props} as={`h${level}`}>
              {renderJSON(content)}
            </Heading>
          )
        }
        case 'accordion':
          return <AccordionView {...attrs}>{renderJSON(content)}</AccordionView>

        case 'orderedList':
          return <OrderedList>{renderJSON(content)}</OrderedList>

        case 'listItem':
          return <ListItem>{renderJSON(content)}</ListItem>

        case 'table':
          return <Table>{renderJSON(content)}</Table>
        case 'tableRow':
          return <Tr {...attrs}>{renderJSON(content)}</Tr>
        case 'tableCell':
          return <Td {...attrs}>{renderJSON(content)}</Td>
        case 'bulletList':
          return <UnorderedList>{renderJSON(content)}</UnorderedList>
        case 'bulletListItem':
          return <ListItem>{renderJSON(content)}</ListItem>
      }
    } catch {
      return null
    }
  })
}

function replace(node: DOMNode) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const props = attributesToProps(node.attribs)
  const type = props['data-type']
  // console.log({ type, props, node })

  switch (type) {
    case 'tabs':
      // eslint-disable-next-line no-case-declarations
      let tabs = JSON.parse(props['data-tabs']) as unknown as {
        title: string
        content: string
        json: any
      }[]

      try {
        tabs = tabs.map((props) => ({
          ...props,
          json: JSON.parse(props.json || '[]'),
        }))
      } catch {
        // silent
      }

      // TODO sjednotit web a admin přes @ssupat/components knihovnu
      return (
        <Tabs
          variant="solid-rounded"
          border="1px solid"
          borderColor="gray.100"
          borderRadius="md"
          py={4}
          mt={4}
        >
          <TabList>
            {tabs.map(({ title }, index) => (
              <Tab
                _active={{ color: 'white', bgColor: 'brand.500' }}
                key={index}
              >
                {title}
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            {tabs.map(({ title, content, json }, index) => (
              <TabPanel key={index}>
                <Box
                  key={title}
                  mb={6}
                  sx={{
                    'a:hover': {
                      color: 'uat_orange',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {renderJSON(json.content)}
                </Box>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      )

    case 'box':
      return (
        <Box sx={props}>
          {/** eslint-disable-next-line @typescript-eslint/ban-ts-comment
           * @ts-ignore */}
          {domToReact(node.children, { replace })}
        </Box>
      )

    case 'html-code-block':
      return (
        <HTMLCodeBlockView
          htmlContent={props['data-html-content']}
          props={{ mt: 8 }}
        />
      )

    case 'accordion':
      return (
        <AccordionView title={props['data-title']}>
          {/** eslint-disable-next-line @typescript-eslint/ban-ts-comment
           * @ts-ignore */}
          {domToReact(node.children, { replace })}
        </AccordionView>
      )
  }

  if (node.type === 'tag' && 'name' in node) {
    switch (node.name) {
      case 'a':
        if (props['data-link-type'] === 'button') {
          return (
            <ButtonLink
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              title={domToReact(node.children, { replace })}
              link={{ href: props.href }}
            />
          )
        }

        return (
          <InternalLink path={props.href}>
            {/** eslint-disable-next-line @typescript-eslint/ban-ts-comment
             * @ts-ignore */}
            {domToReact(node.children, { replace })}
          </InternalLink>
        )
      case 'em':
      case 'b':
      case 'strong':
      case 'i':
      case 'u':
      case 'p':
        console.log(node)
        return (
          <Text w="full" as={node.name} {...props}>
            {/** eslint-disable-next-line @typescript-eslint/ban-ts-comment
             * @ts-ignore */}
            {domToReact(node.children, { replace })}
          </Text>
        )
      case 'td':
        return (
          <Td {...props}>
            {/** eslint-disable-next-line @typescript-eslint/ban-ts-comment
             * @ts-ignore */}
            {domToReact(node.children, { ...props, replace })}
          </Td>
        )
      case 'tr':
        return (
          <Tr {...props}>
            {/** eslint-disable-next-line @typescript-eslint/ban-ts-comment
             * @ts-ignore */}
            {domToReact(node.children, { replace })}
          </Tr>
        )
      case 'tbody':
        return (
          <Tbody {...props}>
            {/** eslint-disable-next-line @typescript-eslint/ban-ts-comment
             * @ts-ignore */}
            {domToReact(node.children, { replace })}
          </Tbody>
        )
      case 'table':
        return (
          <Table className={styles.table} {...props}>
            {/** eslint-disable-next-line @typescript-eslint/ban-ts-comment
             * @ts-ignore */}
            {domToReact(node.children, { replace })}
          </Table>
        )
      case 'li':
        return (
          <UnorderedList>
            {/** eslint-disable-next-line @typescript-eslint/ban-ts-comment
             * @ts-ignore */}
            {node.children.map((node, index) => (
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              <ListItem key={index}>{domToReact([node], { replace })}</ListItem>
            ))}
          </UnorderedList>
        )
      default:
        if (/^h[1-3]$/.test(node.name)) {
          const number = node.name.charAt(-1)
          const size = 4 - Number(number)
          let fs = { base: 'md', md: 'md', lg: 'lg' }
          switch (size) {
            case 1:
              fs = { base: 'xl', md: '2xl', lg: '4xl' }
              break
            case 2:
              fs = { base: 'lg', md: 'xl', lg: '2xl' }
              break
            case 3:
              fs = { base: 'md', md: 'lg', lg: 'xl' }
              break
            case 4:
            default:
              fs = { base: 'md', md: 'md', lg: 'lg' }
              break
          }

          return (
            <Heading w="full" as="p" size={fs} color="gray.700" {...props}>
              {/** eslint-disable-next-line @typescript-eslint/ban-ts-comment
               * @ts-ignore */}
              {domToReact(node.children, { replace })}
            </Heading>
          )
        }
    }
  }

  if (node.type === 'text' && 'data' in node) {
    return <>{node.data}</>
  }

  if ('children' in node && node.children.length) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return domToReact(node.children, { replace })
  }

  return node //domToReact([node], props)
}

export function renderContent(data: any) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return parse(data, { replace })
}

const RichTextSlice = ({ data }: Props) => (
  <div className={styles.container}>
    {data.title && (
      <Heading
        as="h2"
        size={{ base: 'lg', md: 'xl', lg: '2xl' }}
        color="gray.700"
        w="full"
      >
        {data.title}
      </Heading>
    )}

    {data.content && (
      <Stack spacing={1} className={styles.content} w="full" color="gray.700">
        {renderContent(data.content)}
      </Stack>
    )}
  </div>
)

export default RichTextSlice
