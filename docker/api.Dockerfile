# API Dockerfile - NestJS (pnpm workspace)
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10 --activate

# ---- Builder stage: install deps + build ----
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy workspace config first (for layer caching)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/api-biosstel/package.json ./apps/api-biosstel/
COPY libs/shared-types/package.json ./libs/shared-types/
COPY libs/backend/api-users/package.json ./libs/backend/api-users/
COPY libs/backend/api-dashboard/package.json ./libs/backend/api-dashboard/
COPY libs/backend/api-shared/package.json ./libs/backend/api-shared/

# Install ALL dependencies (including devDependencies for build tools like nest-cli)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY tsconfig.base.json ./
COPY apps/api-biosstel ./apps/api-biosstel
COPY libs/shared-types ./libs/shared-types
COPY libs/backend ./libs/backend

# Build from root using pnpm filter (ensures correct workspace resolution)
RUN pnpm --filter api-biosstel run build

# ---- Production image ----
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

CMD ["node", "dist/main.js"]
