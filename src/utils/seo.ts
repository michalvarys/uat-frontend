import { SITE_URL } from 'src/constants'
import { getAttributes } from 'src/utils/data'
import { transformLink } from 'src/utils/link'

/**
 * Odvození SEO metadat.
 *
 * Redaktoři plní komponentu `shared.seo` ve Strapi ručně, ale u naprosté
 * většiny záznamů je zatím prázdná. Proto se každé pole umí odvodit z obsahu
 * a ruční hodnota má jen přednost.
 */

export type SeoComponent = {
  metaTitle?: string | null
  metaDescription?: string | null
  ogImage?: unknown
  canonicalUrl?: string | null
  noindex?: boolean | null
}

export type ResolvedSeo = {
  title: string
  description?: string
  image?: string
  canonical: string
  noindex: boolean
}

const DESCRIPTION_LIMIT = 160

/**
 * Výchozí obrázek pro odkazy bez vlastní grafiky.
 *
 * Záměrně undefined: dřív tu byla cesta na /images/og-default.jpg, který
 * v public/ neexistuje — náhled odkazu by pak byl prázdný čtverec, což je
 * horší než žádný obrázek. Až grafika vznikne, stačí sem doplnit cestu.
 */
export const DEFAULT_OG_IMAGE: string | undefined = undefined

/**
 * Měkké spojovníky a zalomení slouží k zalamování nadpisů v layoutu.
 * Do titulků a popisků nepatří — vyhledávače i náhledy odkazů je zobrazují.
 */
export function cleanupText(value?: string | null): string {
  if (!value) {
    return ''
  }

  return value
    .replace(/­/g, '') // měkký spojovník
    .replace(/\s+/g, ' ')
    .trim()
}

/** Odstraní HTML značky a dekóduje nejběžnější entity. */
function stripHtml(html: string): string {
  return html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

/** Posbírá textové uzly z tiptap dokumentu. */
function extractFromTiptap(node: any, out: string[] = []): string[] {
  if (!node || out.join(' ').length > DESCRIPTION_LIMIT * 3) {
    return out
  }

  if (Array.isArray(node)) {
    node.forEach((child) => extractFromTiptap(child, out))
    return out
  }

  if (typeof node.text === 'string') {
    out.push(node.text)
  }

  if (Array.isArray(node.content)) {
    extractFromTiptap(node.content, out)
  }

  return out
}

/**
 * Text pro popisek z obsahu sekce. Rich text ze Strapi přichází ve dvou
 * podobách — jako HTML řetězec (většina záznamů) nebo jako tiptap JSON.
 */
function extractText(content: unknown): string {
  if (typeof content !== 'string') {
    return ''
  }

  const trimmed = content.trim()

  if (trimmed.startsWith('{')) {
    try {
      const doc = JSON.parse(trimmed)
      return cleanupText(extractFromTiptap(doc.content || doc).join(' '))
    } catch {
      // Nebyl to JSON, zpracujeme níž jako HTML.
    }
  }

  return cleanupText(stripHtml(trimmed))
}

/** Zkrátí text na hranici slova, aby popisek nekončil uprostřed. */
export function truncate(text: string, limit = DESCRIPTION_LIMIT): string {
  const clean = cleanupText(text)
  if (clean.length <= limit) {
    return clean
  }

  // Výsledek včetně výpustky se musí vejít do limitu.
  const cut = clean.slice(0, limit - 1)
  const lastSpace = cut.lastIndexOf(' ')
  // Bez mezery v dohledu (dlouhé slovo) radši tvrdý ořez než prázdný popisek.
  return `${(lastSpace > limit * 0.6
    ? cut.slice(0, lastSpace)
    : cut
  ).trimEnd()}…`
}

/** Najde první použitelný text napříč sekcemi stránky. */
export function descriptionFromSections(sections?: any[]): string {
  if (!Array.isArray(sections)) {
    return ''
  }

  for (const section of sections) {
    const text = extractText(section?.content)
    if (text.length > 30) {
      return text
    }
  }

  return ''
}

/** Absolutní URL obrázku ze Strapi, jak ji vyžadují OG tagy. */
export function imageUrl(image: unknown): string | undefined {
  const attrs = getAttributes(image as any)
  const url = (attrs as any)?.url

  if (typeof url !== 'string' || !url) {
    return undefined
  }

  const absolute = transformLink(url)
  return absolute.startsWith('http') ? absolute : `${SITE_URL}${absolute}`
}

/** Absolutní adresa stránky pro canonical a OG. */
export function pageUrl(path: string, locale?: string): string {
  const clean = `/${path}`.replace(/\/+/g, '/').replace(/\/$/, '')
  // Slovenština běží bez prefixu, ostatní jazyky s ním.
  const prefix = !locale || locale === 'sk' ? '' : `/${locale}`
  return `${SITE_URL}${prefix}${clean || '/'}`
}

type ResolveInput = {
  seo?: SeoComponent | null
  title?: string | null
  description?: string | null
  sections?: any[]
  image?: unknown
  path: string
  locale?: string
}

/**
 * Sloučí ruční metadata z CMS s hodnotami odvozenými z obsahu.
 * Ruční hodnota vždy vyhrává, prázdné pole se doplní z obsahu.
 */
export function resolveSeo({
  seo,
  title,
  description,
  sections,
  image,
  path,
  locale,
}: ResolveInput): ResolvedSeo {
  const resolvedDescription =
    cleanupText(seo?.metaDescription) ||
    truncate(cleanupText(description) || descriptionFromSections(sections))

  return {
    title: cleanupText(seo?.metaTitle) || cleanupText(title),
    description: resolvedDescription || undefined,
    image: imageUrl(seo?.ogImage) || imageUrl(image) || DEFAULT_OG_IMAGE,
    canonical: seo?.canonicalUrl || pageUrl(path, locale),
    noindex: Boolean(seo?.noindex),
  }
}
