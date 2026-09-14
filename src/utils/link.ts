import { BASE_URL } from 'src/constants'

export const transformLink = (url: string): string => {
  url = url?.trim() || ''
  if (url.startsWith('http')) {
    return url
  }

  return `${BASE_URL}${url}`
}

export function isExternalLink(url: string) {
  url = url?.trim() || ''
  const { hostname } = new URL(BASE_URL)
  return url.startsWith('http') && !url.includes(hostname)
}
