# Install dependencies only when needed
FROM node:20-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json ./

RUN npm install --legacy-peer-deps

# Rebuild the source code only when needed
FROM node:20-alpine AS builder
WORKDIR /app

# Build nepotřebuje žádné adresy: API_URL, BASE_URL a domény se čtou
# z proměnných prostředí až při startu kontejneru, takže tentýž image
# běží na stagingu i na produkci.

COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN npm run build

# Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app


ENV NODE_ENV production
# Adresy CMS a domény předává docker compose za běhu —
# viz infra/compose/base.yml.

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Standalone build nese vlastní server.js i jen ty závislosti, které
# aplikace skutečně používá — celý node_modules se proto nekopíruje.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

CMD ["node", "server.js"]