import qs from 'qs'

import { api } from './client'

/**
 * Najde nový slug k zastaralé adrese.
 *
 * Když redaktor přejmenuje stránku, slug se přegeneruje z názvu a původní
 * adresa přestane existovat. Historie drží dvojici stará → nová, takže
 * návštěvník i vyhledávač skončí trvalým přesměrováním na správné místo
 * místo na 404.
 */
export async function findNewSlug(
  oldSlug: string,
  contentType: 'page' | 'news',
  locale: string
): Promise<string | null> {
  try {
    const { data } = await api(
      `/api/slug-histories?${qs.stringify({
        filters: { oldSlug, contentType, locale },
        fields: ['newSlug'],
        pagination: { pageSize: 1 },
      })}`
    )

    const items = Array.isArray(data) ? data : data?.data || []
    const found = items[0]?.newSlug || items[0]?.attributes?.newSlug

    return typeof found === 'string' && found ? found : null
  } catch {
    // Výpadek CMS nesmí změnit 404 na chybu serveru.
    return null
  }
}
