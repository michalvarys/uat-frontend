/**
 * Utility pro náhledy rich-textu.
 *
 * Po migraci Strapi přišel `content` ve dvou podobách:
 *  - starší články: HTML string (`<p>...</p>`)
 *  - novější články: TipTap/ProseMirror dokument serializovaný do stringu
 *    (`{"type":"doc","content":[...]}`)
 *
 * Detail článku řeší obojí v RichTextSlice. Náhledové karty potřebují totéž,
 * ale zkrácené. Ořez se dělá nad zdrojem (HTML/JSON), ne nad hotovými React
 * elementy — jinak by se rozbily tagy.
 */

export const PREVIEW_LENGTH = 200

type ProseMirrorNode = {
  type?: string
  text?: string
  content?: ProseMirrorNode[]
  [key: string]: any
}

/** Rozpozná TipTap dokument. Vrací null, pokud to TipTap JSON není. */
export function parseRichTextDocument(
  content: unknown
): ProseMirrorNode | null {
  if (content && typeof content === 'object') {
    const doc = content as ProseMirrorNode
    return Array.isArray(doc.content) ? doc : null
  }

  if (typeof content !== 'string') {
    return null
  }

  // Levná předběžná kontrola, ať nevoláme JSON.parse na každý HTML článek.
  if (!content.trimStart().startsWith('{')) {
    return null
  }

  try {
    const doc = JSON.parse(content)
    return doc && Array.isArray(doc.content) ? doc : null
  } catch {
    return null
  }
}

/**
 * Ořízne TipTap dokument na `limit` znaků viditelného textu.
 * Marks (tučné, odkazy) na zachovaných uzlech zůstávají, takže náhled
 * vypadá stejně jako detail, jen kratší.
 */
export function truncateRichTextDocument(
  nodes: ProseMirrorNode[],
  limit: number = PREVIEW_LENGTH
): { nodes: ProseMirrorNode[]; truncated: boolean } {
  let remaining = limit
  let truncated = false

  const walk = (items: ProseMirrorNode[]): ProseMirrorNode[] => {
    const result: ProseMirrorNode[] = []

    for (const node of items) {
      if (remaining <= 0) {
        truncated = true
        break
      }

      if (node.type === 'text') {
        const text = node.text ?? ''
        if (text.length <= remaining) {
          remaining -= text.length
          result.push(node)
        } else {
          // Ořezáváme na hranici slova, ať náhled nekončí uprostřed slova.
          const cut = text.slice(0, remaining)
          const lastSpace = cut.lastIndexOf(' ')
          result.push({
            ...node,
            text: (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd(),
          })
          remaining = 0
          truncated = true
        }
        continue
      }

      if (node.content) {
        const children = walk(node.content)
        if (children.length) {
          result.push({ ...node, content: children })
        }
        continue
      }

      // Uzly bez textu (obrázky, oddělovače) do náhledu nepatří.
      truncated = true
    }

    return result
  }

  const result = walk(nodes)
  return { nodes: result, truncated: truncated && result.length > 0 }
}

/**
 * Ořízne HTML string na `limit` znaků viditelného textu.
 * Tagy se počítají mimo limit a otevřené tagy se na konci korektně uzavřou,
 * takže výsledek zůstává validní HTML.
 */
export function truncateHtml(
  html: string,
  limit: number = PREVIEW_LENGTH
): { html: string; truncated: boolean } {
  // Prvky, které se nezavírají — nesmí se dostat na zásobník.
  const voidElements = new Set([
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
  ])

  let remaining = limit
  let out = ''
  let truncated = false
  const openTags: string[] = []
  const tagOrEntity =
    /<\/?([a-zA-Z][a-zA-Z0-9-]*)[^>]*>|&[a-zA-Z#][a-zA-Z0-9]*;/g

  let cursor = 0
  let match: RegExpExecArray | null

  const appendText = (text: string) => {
    if (remaining <= 0) {
      if (text.trim()) truncated = true
      return
    }
    if (text.length <= remaining) {
      out += text
      remaining -= text.length
      return
    }
    const cut = text.slice(0, remaining)
    const lastSpace = cut.lastIndexOf(' ')
    out += (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()
    remaining = 0
    truncated = true
  }

  while ((match = tagOrEntity.exec(html)) !== null) {
    appendText(html.slice(cursor, match.index))
    cursor = match.index + match[0].length

    const token = match[0]

    // Entita (&nbsp;) se počítá jako jeden znak textu.
    if (token.startsWith('&')) {
      if (remaining > 0) {
        out += token
        remaining -= 1
      } else {
        truncated = true
      }
      continue
    }

    const tagName = (match[1] || '').toLowerCase()
    const isClosing = token.startsWith('</')
    const isSelfClosing = token.endsWith('/>') || voidElements.has(tagName)

    if (isClosing) {
      const index = openTags.lastIndexOf(tagName)
      if (index !== -1) {
        openTags.splice(index, 1)
        out += token
      }
      continue
    }

    if (remaining <= 0) {
      truncated = true
      continue
    }

    out += token
    if (!isSelfClosing) {
      openTags.push(tagName)
    }
  }

  appendText(html.slice(cursor))

  // Uzavřít, co zůstalo otevřené — jinak by ořez rozbil layout stránky.
  for (let i = openTags.length - 1; i >= 0; i -= 1) {
    out += `</${openTags[i]}>`
  }

  return { html: out, truncated }
}
