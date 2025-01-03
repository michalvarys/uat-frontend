const path = require('path')
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:1337'
const FRONTEND_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'http://0.0.0.0:3000/cms'
const FRONTEND_DOMAIN = process.env.NEXT_FRONTEND_DOMAIN
const BACKEND_DOMAIN = process.env.NEXT_BACKEND_DOMAIN
const feDomain = new URL(FRONTEND_BASE_URL).hostname
const beDomain = new URL(API_BASE_URL).hostname

module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      feDomain,
      beDomain,
      FRONTEND_DOMAIN,
      BACKEND_DOMAIN,
      'localhost',
    ].filter(Boolean),
  },

  i18n: {
    locales: ['sk', 'en'],
    defaultLocale: 'sk',
    localeDetection: false,
  },

  serverRuntimeConfig: {
    apiToken: process.env.API_TOKEN,
  },

  publicRuntimeConfig: {
    baseURL: API_BASE_URL || FRONTEND_BASE_URL,
  },

  webpack(config, { isServer }) {
    // Add TypeScript loader for files in node_modules
    config.module.rules.push({
      test: /\.tsx?$/,
      include: [path.resolve(__dirname, 'node_modules/@ssupat/components')],
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-typescript',
              '@babel/preset-react',
              // '@babel/preset-es2015',
            ],
          },
        },
      ],
    })

    return config
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
