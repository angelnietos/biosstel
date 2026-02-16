# API Dockerfile - NestJS
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10 --activate

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files for workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api-biosstel/package.json ./apps/api-biosstel/
COPY libs/shared/package.json ./libs/shared/
COPY libs/backend/api-users/package.json ./libs/backend/api-users/
COPY libs/backend/api-dashboard/package.json ./libs/backend/api-dashboard/
COPY libs/backend/api-shared/package.json ./libs/backend/api-shared/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api-biosstel/node_modules ./apps/api-biosstel/node_modules 2>/dev/null || true

# Copy workspace config
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json ./

# Copy app source
COPY apps/api-biosstel ./apps/api-biosstel

# Copy shared libraries
COPY libs/shared ./libs/shared
COPY libs/backend/api-users ./libs/backend/api-users
COPY libs/backend/api-dashboard ./libs/backend/api-dashboard
COPY libs/backend/api-shared ./libs/backend/api-shared

WORKDIR /app/apps/api-biosstel

# Build
ENV NODE_ENV=production
RUN pnpm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy built application
COPY --from=builder /app/apps/api-biosstel/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

USER nodejs

EXPOSE 4000

ENV PORT=4000
ENV NODE_ENV=production

CMD ["node", "dist/main.js"]
