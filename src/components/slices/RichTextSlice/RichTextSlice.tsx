import { As, chakra, Heading } from '@chakra-ui/react'
import parse, { domToReact, DOMNode } from 'html-react-parser'
import RichTextType from '../../../types/data/RichTextType'
import styles from './RichTextSlice.module.scss'

type Props = {
  data: RichTextType
}

function replace(node: DOMNode) {
  if (node.type === 'tag' && 'name' in node && /^h[1-3]$/.test(node.name)) {
    const number = node.name.at(-1)
    const size = 4 - Number(number)

    return (
      <Heading as="p" size={`${size > 1 ? size : ''}xl`} color="gray.900">
        {/** eslint-disable-next-line @typescript-eslint/ban-ts-comment
         * @ts-ignore */}
        {domToReact(node.children, { replace })}
      </Heading>
    )
  }

  return node
}

const RichTextSlice = ({ data }: Props) => {
  return (
    <div className={styles.container}>
      {data.title && (
        <Heading as="h2" size="4xl" color="gray.900">
          {data.title}
        </Heading>
      )}

      {data.content && (
        <chakra.div className={styles.content} color="gray.800">
          {parse(data.content, {
            replace,
          })}
        </chakra.div>
      )}
    </div>
  )
}

export default RichTextSlice
