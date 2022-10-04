import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

const transformLink = (url: string): string => {
  if (url.search('://') >= 0) {
    return url;
  }

  return `${publicRuntimeConfig.baseURL}${url}`;
}

const transformDocLink = (url: string): string => {
  const baseURL = process.env.NEXT_PUBLIC_DOC_URL;
  const port = process.env.NEXT_PUBLIC_SECURE_API_PORT;

  if (url.search('://') >= 0) {
    return url;
  }
  return `${baseURL}:${port}${url}`;
}

export {
  transformLink,
  transformDocLink,
}
