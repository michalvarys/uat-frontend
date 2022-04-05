const transformLink = (url: string): string => {
  const baseURL = process.env.NEXT_PUBLIC_IMAGE_URL;
  const port = process.env.NEXT_PUBLIC_API_PORT;

  if (url.search('://') >= 0) {
    return url;
  }
  return `${baseURL}:${port}${url}`;
}

export {
  transformLink,
}
