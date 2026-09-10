# ==============================================================================
# andiamo-site — production Dockerfile (multi-stage, Next.js standalone)
# Target: < 200MB. No DB, no migrations.
#
# Build context: /Users/andiclaw/Documents/GitHub/andiamo-site
# ==============================================================================

FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm install --omit=dev

FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci || npm install
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3019
ENV HOSTNAME=0.0.0.0

# Drop the package manager from the RUNTIME image. Nothing here uses it: the
# entrypoint is `node server.js`, the healthcheck is wget, and the standalone
# server never shells out to npm (verified 2026-09-10 by serving every route of
# this build with npm absent from PATH - / /about /privacy /terms all 200).
# Defender flags 11 npm-CLI internals on the live andiamo-site image
# (tar, glob, minimatch, pacote, sigstore, @sigstore/core, cross-spawn,
# brace-expansion, ip-address, diff, postcss-selector-parser). None of them are
# in this app's production dependency closure - they ship inside the base
# image's bundled npm. Removing software beats upgrading software we do not run.
RUN rm -rf /usr/local/lib/node_modules/npm \
           /usr/local/bin/npm /usr/local/bin/npx

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3019

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget --quiet --spider http://localhost:3019/ || exit 1

CMD ["node", "server.js"]
