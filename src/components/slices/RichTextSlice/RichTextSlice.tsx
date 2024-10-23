import { Heading, Text, Stack } from '@chakra-ui/react'
import parse, { domToReact, DOMNode } from 'html-react-parser'
import RichTextType from '../../../types/data/RichTextType'
import styles from './RichTextSlice.module.scss'

type Props = {
  data: RichTextType
}

function replace(node: DOMNode) {
  if (node.type === 'tag' && 'name' in node) {
    switch (node.name) {
      case 'strong':
        return (
          <Text w="full" as="b">
            {/** eslint-disable-next-line @typescript-eslint/ban-ts-comment
             * @ts-ignore */}
            {domToReact(node.children, { replace })}
          </Text>
        )

      case 'i':
        return (
          <Text w="full" as="i">
            {/** eslint-disable-next-line @typescript-eslint/ban-ts-comment
             * @ts-ignore */}
            {domToReact(node.children, { replace })}
          </Text>
        )

      case 'p':
        return (
          <Text w="full" as="span">
            {/** eslint-disable-next-line @typescript-eslint/ban-ts-comment
             * @ts-ignore */}
            {domToReact(node.children, { replace })}
          </Text>
        )

      default:
        if (/^h[1-3]$/.test(node.name)) {
          const number = node.name.charAt(-1)
          const size = 4 - Number(number)
          let fs = { base: 'lg', md: 'xl', lg: '2xl' }
          switch (size) {
            case 1:
              fs = { base: 'lg', md: 'xl', lg: '2xl' }
              break
            case 2:
              fs = { base: 'md', md: 'lg', lg: 'xl' }
              break
            case 3:
              fs = { base: 'md', md: 'md', lg: 'lg' }
              break
          }

          return (
            <Heading w="full" as="p" size={fs} color="gray.700">
              {/** eslint-disable-next-line @typescript-eslint/ban-ts-comment
               * @ts-ignore */}
              {domToReact(node.children, { replace })}
            </Heading>
          )
        }
    }
  }

  return node
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
        {parse(data.content, {
          replace,
        })}
      </Stack>
    )}
  </div>
)

export default RichTextSlice
