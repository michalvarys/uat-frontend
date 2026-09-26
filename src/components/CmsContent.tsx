'use client'

import { Stack } from '@chakra-ui/react'
import { ReactNode, useMemo } from 'react'

import {
  renderContent,
  renderDocument,
} from 'src/components/slices/RichTextSlice/RichTextSlice'
import { parseRichTextDocument } from 'src/utils/richText'

type Props = {
  /** Hodnota pole ze Strapi. */
  data: unknown
  /** Třída pro obalový prvek, ať si volající zachová své odsazení a typografii. */
  className?: string
  /** Vykreslí se, když je pole prázdné. */
  fallback?: ReactNode
}

/**
 * Vykreslí textové pole z CMS bez ohledu na formát, ve kterém je uložené.
 *
 * Editor ve Strapi ukládá obsah do týchž polí ve třech podobách:
 * jako prostý text (nejstarší záznamy), jako HTML a — od přechodu
 * na bloky — jako serializovaný TipTap dokument. Kdo vykresloval
 * pole přímo přes `{festival.description}`, zobrazil u třetí varianty
 * surové JSON včetně `{"type":"doc","content":[…]}`.
 *
 * Rozlišení formátu i vykreslení bloků řeší RichTextSlice, který se
 * používá na detailu článků. Tahle komponenta z něj dělá jeden vstupní
 * bod pro ostatní místa, aby se stejný obsah vykresloval všude shodně.
 */
export function CmsContent({ data, className, fallback = null }: Props) {
  const content = useMemo(() => {
    // TipTap dokument — objekt nebo jeho serializovaná podoba.
    const document = parseRichTextDocument(data)
    if (document) {
      return renderDocument(document.content)
    }

    if (typeof data === 'string' && data.trim()) {
      // HTML se naparsuje včetně vlastních uzlů (galerie, akordeony).
      // U prostého textu vrátí parse tentýž text, takže stačí jedna větev.
      return renderContent(data)
    }

    return null
  }, [data])

  if (!content) {
    return <>{fallback}</>
  }

  return (
    <Stack spacing={1} className={className} w="full">
      {content}
    </Stack>
  )
}

export default CmsContent
