import type { MetadataRoute } from 'next'

import { getPagesData } from '@/queries/pages'
import { getNewsByLocales } from '@/queries/news'
import { getStudyList } from 'src/queries/studies'
import { getEventList } from '@/queries/events'
import { getFestivalList } from '@/queries/festivals'
import { SITE_URL } from 'src/constants'
import { LOCALES, DEFAULT_LOCALE, localePath } from 'src/i18n/config'

export const revalidate = 3600

type Entry = MetadataRoute.Sitemap[number]

/**
 * Jeden záznam pro každou adresu, s odkazy na jazykové varianty (hreflang).
 * Slovenština běží bez prefixu, ostatní jazyky s ním.
 */
function entry(
  path: string,
  options: { lastModified?: string | Date; priority?: number } = {}
): Entry {
  const languages = Object.fromEntries(
    LOCALES.map((locale) => [locale, `${SITE_URL}${localePath(path, locale)}`])
  )

  return {
    url: `${SITE_URL}${localePath(path, DEFAULT_LOCALE)}`,
    lastModified: options.lastModified ?? new Date(),
    changeFrequency: 'weekly',
    priority: options.priority ?? 0.5,
    alternates: { languages },
  }
}

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch {
    // Výpadek CMS nesmí shodit celou sitemap — radši neúplná než žádná.
    return fallback
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = LOCALES as unknown as string[]

  const [pages, news, studies, events, festivals] = await Promise.all([
    safe(() => getPagesData(locales), [] as any[]),
    safe(() => getNewsByLocales(locales), [] as any[]),
    safe(() => getStudyList(locales), [] as any[]),
    safe(() => getEventList(locales), [] as any[]),
    safe(() => getFestivalList(locales), [] as any[]),
  ])

  const staticPages: Entry[] = [
    entry('/', { priority: 1 }),
    entry('/news', { priority: 0.8 }),
    entry('/teachers', { priority: 0.6 }),
    entry('/galleries', { priority: 0.6 }),
    entry('/documents', { priority: 0.4 }),
    entry('/about-school', { priority: 0.7 }),
  ]

  const pageEntries = pages
    .filter((item: any) => typeof item.slug === 'string' && item.slug !== '')
    .map((item: any) =>
      entry(`/pages/${item.slug}`, {
        lastModified: item.updatedAt,
        priority: 0.6,
      })
    )

  const newsEntries = news
    .filter((item: any) => typeof item.slug === 'string' && item.slug !== '')
    .map((item: any) =>
      entry(`/news/${item.slug}`, {
        lastModified: item.updatedAt || item.date,
        priority: 0.7,
      })
    )

  const studyEntries = studies.map((item: any) =>
    entry(`/studies/${item.id}`, {
      lastModified: item.updatedAt,
      priority: 0.8,
    })
  )

  const eventEntries = events.map((item: any) =>
    entry(`/events/${item.id}`, {
      lastModified: item.updatedAt,
      priority: 0.5,
    })
  )

  const festivalEntries = festivals.map((item: any) =>
    entry(`/festivals/${item.id}`, {
      lastModified: item.updatedAt,
      priority: 0.6,
    })
  )

  return [
    ...staticPages,
    ...studyEntries,
    ...newsEntries,
    ...pageEntries,
    ...festivalEntries,
    ...eventEntries,
  ]
}
