# API Dockerfile - Node.js + GraphQL
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
COPY apps/api-biosstel/package.json ./apps/api-biosstel/
COPY apps/api-biosstel/microservices/auth/package.json ./apps/api-biosstel/microservices/auth/
COPY apps/api-biosstel/microservices/common/package.json ./apps/api-biosstel/microservices/common/
COPY libs/shared-types/package.json ./libs/shared-types/

# Install dependencies
RUN npm ci

# Copy source code
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY apps/api-biosstel ./apps/api-biosstel
COPY libs/shared-types ./libs/shared-types
COPY tsconfig.base.json ./
COPY package.json ./

WORKDIR /app/apps/api-biosstel

# Build
ENV NODE_ENV=production
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=builder /app/apps/api-biosstel/build ./build
COPY --from=builder /app/apps/api-biosstel/microservices/auth/build ./microservices/auth/build
COPY --from=builder /app/apps/api-biosstel/microservices/common/build ./microservices/common/build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

USER nodejs

EXPOSE 4000

ENV PORT=4000
ENV NODE_ENV=production

CMD ["node", "build/app.js"]