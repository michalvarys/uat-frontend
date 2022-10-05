import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

export const transformLink = (url: string): string => {
  if (url.search('://') >= 0) {
    return url;
  }

  return `${publicRuntimeConfig.baseURL}${url}`;
}
