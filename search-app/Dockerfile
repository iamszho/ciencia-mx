# 1. Install dependencies
FROM node:20.20.0-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 2. Build app
ARG API_BASE_URL
ARG APP_BASE_URL
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV API_BASE_URL=$API_BASE_URL
ENV APP_BASE_URL=$APP_BASE_URL

FROM node:20.20.0-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3. Copy production files
FROM node:20.20.0-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

USER nextjs

EXPOSE 3000

# Copy standalone output
COPY --chown=nextjs:nodejs --from=builder /app/.next/standalone ./
COPY --chown=nextjs:nodejs --from=builder /app/public ./public
COPY --chown=nextjs:nodejs --from=builder /app/.next/static ./.next/static

CMD ["node", "server.js"]
