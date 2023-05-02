import ReactMarkdown from 'react-markdown'

// TODO
export function CodeSlice(section) {
  // eslint-disable-next-line react/no-children-prop
  return <ReactMarkdown children={section.content} />
}
