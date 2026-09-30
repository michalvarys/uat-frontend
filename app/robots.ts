import type { MetadataRoute } from 'next'

import { SITE_URL } from 'src/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /cms je proxy na Strapi, do indexu nepatří.
      disallow: ['/cms/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
