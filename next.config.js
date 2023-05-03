const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:1337'

const API_IMAGES_URL =
  process.env.NEXT_PUBLIC_IMAGE_URL || 'http://0.0.0.0:1337'

const FRONTEND_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'http://0.0.0.0:3000'
const FRONTEND_DOMAIN = process.env.NEXT_FRONTEND_DOMAIN
const BACKEND_DOMAIN = process.env.NEXT_BACKEND_DOMAIN

module.exports = {
  reactStrictMode: true,
  images: {
    domains: [FRONTEND_DOMAIN, BACKEND_DOMAIN, 'localhost'].filter(Boolean),
  },

  i18n: {
    locales: ['sk', 'en'],
    defaultLocale: 'sk',
    localeDetection: false,
  },

  serverRuntimeConfig: {},

  publicRuntimeConfig: {
    baseURL: FRONTEND_BASE_URL,
  },

  rewrites() {
    return [
      {
        source: '/cms/:path*',
        destination: `${API_BASE_URL}/:path*`,
      },
    ]
  },
}
