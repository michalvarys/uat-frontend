import {
  Heading,
  Text,
  Stack,
  Tr,
  Td,
  Table,
  Tbody,
  List,
  OrderedList,
  UnorderedList,
  ListItem,
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

type Props = {
  data: RichTextType
}

function replace(node: DOMNode) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const props = attributesToProps(node.attribs)

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
        {/** eslint-disable-next-line @typescript-eslint/ban-ts-comment
         * @ts-ignore */}
        {parse(data.content, { replace })}
      </Stack>
    )}
  </div>
)

export default RichTextSlice
