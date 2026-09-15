'use client'

import { useEffect, useState, useCallback, useMemo, cloneElement } from 'react'
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
  chakra,
  ResponsiveValue,
  FlexProps,
} from '@chakra-ui/react'
import parse, {
  domToReact,
  DOMNode,
  attributesToProps,
} from 'html-react-parser'
import RichTextType from '../../../types/data/RichTextType'
import styles from './RichTextSlice.module.scss'
import InternalLink from '@/components/navigation/InternalLink'
import ButtonLink, {
  ButtonLinkImageType,
} from '@/components/navigation/ButtonLink'
import {
  GalleryView,
  AccordionView,
  HTMLCodeBlockView,
  TabsView,
  TapsViewProps,
  CardsView,
  renderJSON,
} from '@ssupat/components'
import axios from 'axios'
import { DbImage } from '@/components/DbImage'
import { LinkView } from '@ssupat/components/src/components/editor/link/LinkView'
import Link from 'next/link'
import { useAppRouter as useRouter } from 'src/hooks/useAppRouter'

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

function CustomLink({ href, type, children, target, isDownload }) {
  const link = useLink({ href })

  const content =
    type === 'link' ? (
      <InternalLink path={link} target={target}>
        {children}
      </InternalLink>
    ) : (
      <ButtonLink
        imageType={
          isDownload ? ButtonLinkImageType.Download : ButtonLinkImageType.Arrow
        }
        target={target}
        title={children}
        link={{ href: link }}
      />
    )

  return <chakra.div display="inline-block">{content}</chakra.div>
}

CardsView.setCardImageRenderer((card) => (
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
))

function LinkRenderer({ link: linkProps, children, ...props }) {
  const link = useLink({ href: linkProps.href })

  return (
    <Link href={link} target={linkProps.target} {...props}>
      {children}
    </Link>
  )
}

LinkView.setLinkRenderer(LinkRenderer)

function replace(node: DOMNode) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const props = attributesToProps(node.attribs)
  const type = props['data-type']
  console.log({ type, props, node })

  switch (type) {
    case 'flexbox': {
      const responsive = JSON.parse(props['data-responsive'] || '{}')
      const direction = props['data-direction']
      const flexDirection = {
        base: responsive?.mobile?.direction || direction,
        md: responsive?.tablet?.direction,
        lg: direction,
      } as FlexProps['flexDirection']

      return (
        <Box
          display="flex"
          {...props}
          flexDirection={flexDirection}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          // eslint-disable-next-line react/no-children-prop
          children={domToReact(node.children, { replace })}
        />
      )
    }
    case 'custom-link': {
      const linkType = props['data-link-type']
      const linkCategory = props['data-link-category']
      // const recordType = props['data-record-type']
      // const recordId = props['data-record-id']
      // console.log(
      //   'custom-link',
      //   props,
      // )
      return (
        <CustomLink
          {...props}
          target={props.target || '_self'}
          href={props.href}
          type={linkType}
          isDownload={linkCategory === 'download'}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          // eslint-disable-next-line react/no-children-prop
          children={domToReact(node.children, { replace })}
        />
      )
    }
    case 'card-list': {
      const cards = JSON.parse(props['data-cards'] || '{}')
      const columns = JSON.parse(props['data-columns'] || '{}')
      return <CardsView cards={cards} columns={columns} />
    }

    case 'gallery': {
      const gallery = JSON.parse(props['data-gallery'] || '{}')
      return <GalleryView {...gallery} attrs={gallery as any} />
    }

    case 'chakraImage':
      // alt chodí z CMS, ale u starších obrázků chybí. next/image ho
      // vyžaduje a bez něj hlásí chybu; prázdný řetězec je pro čtečky
      // korektní označení dekorativního obrázku.
      return <Image alt="" {...props} />
    case 'tabs':
      // eslint-disable-next-line no-case-declarations
      let tabs = []
      try {
        tabs = JSON.parse(
          props['data-tabs']
        ) as unknown as TapsViewProps['tabs']

        tabs = tabs.map((props) => ({
          ...props,
          json: JSON.parse(props.json || '[]'),
        }))
      } catch {
        // silent
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        tabs = node?.children?.map((child: any) => ({
          title: child.attribs['data-title'],
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          content: domToReact(child.children, { replace }),
        }))
      }

      console.log('tabs', props, tabs)
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
          <a
            {...props}
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
      case 'span':
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
      case 'table': {
        // Editor ukládá <col> jako přímé potomky <table>. HTML je tam
        // nepovoluje, prohlížeč je při parsování přesune a vznikne rozdíl
        // proti serverovému renderu (hydratační chyba). Obalíme je sami.
        const cols = node.children.filter(
          (child: any) => child.name === 'col' || child.name === 'colgroup'
        )
        const rest = node.children.filter(
          (child: any) => child.name !== 'col' && child.name !== 'colgroup'
        )

        return (
          <Table className={styles.table} {...props}>
            {cols.length > 0 && (
              <colgroup>
                {/** eslint-disable-next-line @typescript-eslint/ban-ts-comment
                 * @ts-ignore */}
                {domToReact(
                  cols.flatMap((c: any) =>
                    c.name === 'colgroup' ? c.children : [c]
                  ),
                  { replace }
                )}
              </colgroup>
            )}
            {/** eslint-disable-next-line @typescript-eslint/ban-ts-comment
             * @ts-ignore */}
            {domToReact(rest, { replace })}
          </Table>
        )
      }
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
  // Obsah ze Strapi nemusí být řetězec: tiptap ukládá dokument jako objekt
  // a starší záznamy mohou mít pole prázdné. html-react-parser v takovém
  // případě vyhodí "First argument must be a string" a shodí celý build.
  if (typeof data !== 'string') {
    return null
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return parse(data, { replace })
}

/**
 * renderJSON vrací u odstavce jen jeho vnitřek (`case 'paragraph'` nevrací
 * žádný element), takže by se všechny odstavce slily do jednoho bloku textu.
 * Odstavce nejvyšší úrovně proto obalíme sami; ostatní uzly (tabulky,
 * galerie, akordeony, nadpisy) necháme na renderJSON.
 */
function renderDocument(nodes: any[]) {
  return nodes.map((node, index) => {
    const key = `${node?.type ?? 'node'}-${index}`

    if (node?.type === 'paragraph') {
      // Prázdný = neobsahuje nic než textové uzly se samými mezerami
      // (CMS tam ukládá nbsp). Obrázek nebo zalomení prázdný není.
      const isEmpty = !node.content?.some((child: any) =>
        child?.type === 'text' ? (child.text ?? '').trim() !== '' : true
      )

      // Prázdný odstavec drží v CMS vertikální mezeru — zachováme ji.
      if (isEmpty) {
        return <Box key={key} height={4} aria-hidden />
      }

      return (
        <Text key={key} as="p" textAlign={node.attrs?.textAlign}>
          {renderJSON(node.content)}
        </Text>
      )
    }

    return <Box key={key}>{renderJSON([node])}</Box>
  })
}

const RichTextSlice = ({ data }: Props) => {
  const content = useMemo(() => {
    try {
      const { content } = JSON.parse(data.content)

      if (Array.isArray(content)) {
        // Stejný obal i styly jako HTML větev, ať detail vypadá shodně
        // bez ohledu na to, ve kterém formátu je článek uložený.
        return (
          <Stack
            spacing={1}
            className={styles.content}
            w="full"
            color="gray.700"
          >
            {renderDocument(content)}
          </Stack>
        )
      }
    } catch {
      // do nothing
    }

    // render html
    return (
      <Stack spacing={1} className={styles.content} w="full" color="gray.700">
        {renderContent(data.content)}
      </Stack>
    )
  }, [data.content])

  return (
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

      {content}
    </div>
  )
}

export default RichTextSlice
