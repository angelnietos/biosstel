# Frontend Dockerfile - Next.js
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
COPY apps/front-biosstel/package.json ./apps/front-biosstel/
COPY libs/shared-types/package.json ./libs/shared-types/

# Install dependencies
RUN npm ci

# Copy source code
COPY libs/shared-types ./libs/shared-types
COPY apps/front-biosstel ./apps/front-biosstel
COPY tsconfig.base.json ./

# Build shared types
RUN npm run build -w libs/shared-types

# Production build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/libs/shared-types ./libs/shared-types
COPY --from=deps /app/apps/front-biosstel ./apps/front-biosstel
COPY --from=deps /app/tsconfig.base.json ./
COPY package.json ./

WORKDIR /app/apps/front-biosstel
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/front-biosstel/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/front-biosstel/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/front-biosstel/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]