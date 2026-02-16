# Frontend Dockerfile - Next.js
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10 --activate

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files for workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/front-biosstel/package.json ./apps/front-biosstel/
COPY libs/shared-types/package.json ./libs/shared-types/
COPY libs/frontend/ui/package.json ./libs/frontend/ui/ 2>/dev/null || true
COPY libs/frontend/shared/package.json ./libs/frontend/shared/ 2>/dev/null || true
COPY libs/frontend/ui-layout/package.json ./libs/frontend/ui-layout/ 2>/dev/null || true
COPY libs/frontend/platform/package.json ./libs/frontend/platform/ 2>/dev/null || true
COPY libs/frontend/auth/package.json ./libs/frontend/auth/ 2>/dev/null || true
COPY libs/frontend/dashboard/package.json ./libs/frontend/dashboard/ 2>/dev/null || true
COPY libs/frontend/users/package.json ./libs/frontend/users/ 2>/dev/null || true

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy workspace config
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json ./

# Copy app source
COPY apps/front-biosstel ./apps/front-biosstel

# Copy shared libraries
COPY libs/shared-types ./libs/shared-types
COPY libs/frontend ./libs/frontend

WORKDIR /app/apps/front-biosstel

# Build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Next.js standalone output
RUN pnpm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application from standalone output
COPY --from=builder /app/apps/front-biosstel/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/front-biosstel/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/front-biosstel/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/front-biosstel/server.js"]
