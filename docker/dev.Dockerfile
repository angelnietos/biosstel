# =============================================================
# Development Dockerfile
# Lightweight image for local dev with hot reload
# All devs use the same Node/pnpm version → consistent lockfile
# =============================================================
FROM node:20-alpine

# System deps for native modules (bcrypt, sharp, etc.)
RUN apk add --no-cache libc6-compat

# pnpm (same version pinned for all devs)
RUN corepack enable && corepack prepare pnpm@10 --activate

WORKDIR /app

# Source code is mounted as a volume — nothing is COPY'd here
# node_modules lives in a named Docker volume (Linux binaries, not shared with host)
