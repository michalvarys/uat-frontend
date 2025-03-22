import { useEffect, useState, useCallback } from 'react'
import {
  Heading,
  Text,
  Stack,
  Tr,
  Td,
  Table,
  Tbody,
  UnorderedList,
  ListItem,
  Box,
  Image,
  Card,
  SimpleGrid,
  CardBody,
  CardFooter,
  chakra,
  IconButton,
  Link,
} from '@chakra-ui/react'
import parse, {
  domToReact,
  DOMNode,
  attributesToProps,
} from 'html-react-parser'
import RichTextType from '../../../types/data/RichTextType'
import styles from './RichTextSlice.module.scss'
import InternalLink from '@/components/navigation/InternalLink'
import ButtonLink from '@/components/navigation/ButtonLink'
import {
  GalleryView,
  AccordionView,
  HTMLCodeBlockView,
  TabsView,
  TapsViewProps,
} from '@ssupat/components'
import axios from 'axios'
import { DbImage } from '@/components/DbImage'

type Props = {
  data: RichTextType
}

function useLink({ href }) {
  const [link, setLink] = useState('')

  const getLink = useCallback(async () => {
    if (!href) {
      return
    }

    if (href.startsWith('http') || href.startsWith('/')) {
      setLink(href)
      return
    }

    const [type, id] = href.split(':')
    setLink(`/${type}/${id}`)

    try {
      const { data } = await axios(`/api/${type}/${id}`)
      setLink(`/${type}/${data.attributes.slug}`)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }, [href])

  useEffect(() => {
    getLink()
  }, [href, getLink])

  return link
}

function CustomLink({ href, type, children }) {
  const link = useLink({ href })

  if (type === 'button') {
    return <ButtonLink title={children} link={{ href: link }} />
  }

  return <InternalLink path={link}>{children}</InternalLink>
}

function CardItem({ card }) {
  const link = useLink(card)

  return (
    <Card key={card.id}>
      {card.image && (
        <CardBody
          pos="relative"
          minH="200px"
          sx={{
            img: {
              borderRadius: 'md',
            },
          }}
        >
          <DbImage
            data={card.image}
            format="large"
            props={(image) => ({
              width: image.width,
              height: image.height,
              layout: 'fill',
              objectFit: 'cover',
            })}
          />
        </CardBody>
      )}

      <Box
        as={CardFooter}
        display="flex"
        justify="center"
        alignContent="center"
        p={5}
        pt={0}
        w="full"
      >
        <Heading
          w="80%"
          position="relative"
          mt="2"
          textAlign="center"
          size="md"
        >
          {card.title}
        </Heading>

        <IconButton
          as={Link}
          target="_self"
          href={link}
          w="10%"
          variant="link"
          color="gray.800"
          _hover={{
            textDecoration: 'none',
          }}
          colorScheme="gray"
          aria-label="See menu"
          icon={<chakra.span fontSize="xl">{'→'}</chakra.span>}
        />
      </Box>
    </Card>
  )
}

function replace(node: DOMNode) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const props = attributesToProps(node.attribs)
  const type = props['data-type']
  // console.log({ type, props, node })

  switch (type) {
    case 'card-list': {
      const list = JSON.parse(props['data-cards'] || '{}')
      const columns = JSON.parse(props['data-columns'] || '{}')
      console.log({ props, type, columns, list })
      return (
        <SimpleGrid
          gap={2}
          spacing={2}
          minInlineSize="300px"
          columns={columns}
          pb={{ base: '40px', md: '60px', lg: '84px' }}
        >
          {list.map((card, index) => (
            <CardItem card={card} key={index} />
          ))}
        </SimpleGrid>
      )
    }
    case 'gallery': {
      const gallery = JSON.parse(props['data-gallery'] || '{}')
      return <GalleryView attrs={gallery} />
    }
    case 'chakraImage':
      // eslint-disable-next-line jsx-a11y/alt-text
      return <Image {...props} />
    case 'tabs':
      // eslint-disable-next-line no-case-declarations
      let tabs = JSON.parse(
        props['data-tabs']
      ) as unknown as TapsViewProps['tabs']

      try {
        tabs = tabs.map((props) => ({
          ...props,
          json: JSON.parse(props.json || '[]'),
        }))
      } catch {
        // silent
      }
      return <TabsView tabs={tabs} />

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
        return (
          <CustomLink
            {...props}
            href={props.href}
            type={props['data-link-type']}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // eslint-disable-next-line react/no-children-prop
            children={domToReact(node.children, { replace })}
          />
        )
      case 'em':
      case 'b':
      case 'strong':
      case 'i':
      case 'u':
      case 'p':
        // console.log(node)
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
