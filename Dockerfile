# Install dependencies only when needed
FROM node:16.15.1-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json ./

RUN npm install -g npm@9.6.5
RUN npm install --legacy-peer-deps

# Rebuild the source code only when needed
FROM node:16.15.1-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_IMAGE_URL
ARG NEXT_PUBLIC_API_PORT
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_SECURE_API_PORT
ARG NEXT_FRONTEND_DOMAIN
ARG NEXT_BACKEND_DOMAIN

ENV NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL}"
ENV NEXT_PUBLIC_IMAGE_URL="${NEXT_PUBLIC_IMAGE_URL}"
ENV NEXT_PUBLIC_API_PORT="${NEXT_PUBLIC_API_PORT}"
ENV NEXT_PUBLIC_BASE_URL="${NEXT_PUBLIC_BASE_URL}"
ENV NEXT_PUBLIC_SECURE_API_PORTL="${NEXT_PUBLIC_SECURE_API_PORTL}"
ENV NEXT_FRONTEND_DOMAINL="${NEXT_FRONTEND_DOMAINL}"
ENV NEXT_BACKEND_DOMAINL="${NEXT_BACKEND_DOMAINL}"

COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN npm install -g npm@9.6.5
RUN npm run build
RUN npm install --legacy-peer-deps --production --ignore-scripts --prefer-offline

# Production image, copy all the files and run next
FROM node:16.15.1-alpine AS runner
WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_IMAGE_URL
ARG NEXT_PUBLIC_API_PORT
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_SECURE_API_PORT
ARG NEXT_FRONTEND_DOMAIN
ARG NEXT_BACKEND_DOMAIN

ENV NODE_ENV production
ENV NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL}"
ENV NEXT_PUBLIC_IMAGE_URL="${NEXT_PUBLIC_IMAGE_URL}"
ENV NEXT_PUBLIC_API_PORT="${NEXT_PUBLIC_API_PORT}"
ENV NEXT_PUBLIC_SECURE_API_PORTL="${NEXT_PUBLIC_SECURE_API_PORTL}"
ENV NEXT_FRONTEND_DOMAINL="${NEXT_FRONTEND_DOMAINL}"
ENV NEXT_BACKEND_DOMAINL="${NEXT_BACKEND_DOMAINL}"

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

# EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

CMD ["npm", "start"]