# Frontend Dockerfile - Next.js (pnpm workspace)
FROM node:25-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10 --activate

# ---- Builder stage: install deps + build ----
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy workspace config first (for layer caching)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/front-biosstel/package.json ./apps/front-biosstel/
COPY libs/shared-types/package.json ./libs/shared-types/

# Install ALL dependencies (including devDependencies for build tools)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY tsconfig.base.json ./
COPY apps/front-biosstel ./apps/front-biosstel
COPY libs/shared-types ./libs/shared-types
COPY libs/frontend ./libs/frontend

# Build from root using pnpm filter
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter front-biosstel run build

# ---- Production image ----
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application from standalone output
COPY --from=builder /app/apps/front-biosstel/public ./apps/front-biosstel/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/front-biosstel/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/front-biosstel/.next/static ./apps/front-biosstel/.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/front-biosstel/server.js"]
