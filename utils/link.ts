import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

export const transformLink = (url: string): string => {
  url = url.trim()
  if (url.startsWith('http')) {
    return url
  }

  return `${publicRuntimeConfig.baseURL}${url}`
}

export function isExternalLink(url: string) {
  url = url.trim()
  const { hostname } = new URL(publicRuntimeConfig.baseURL)
  return url.startsWith('http') && !url.includes(hostname)
}
