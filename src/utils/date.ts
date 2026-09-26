import moment from 'moment'
import 'moment/locale/sk'

/**
 * Formátování dat na jednom místě.
 *
 * Slovenské locale se dřív importovalo jen v některých stránkách. Komponenty
 * s datem se ale používají i jinde, takže server renderoval "17 jún 2026"
 * a klient "17 Jun 2026" — React to hlásil jako hydratační chybu
 * a překreslil celý blok.
 */
moment.locale('sk')

export function formatDate(
  value?: string | Date | null,
  pattern = 'DD MMM YYYY'
) {
  if (!value) {
    return ''
  }

  return moment(value).locale('sk').format(pattern)
}

export { moment }
