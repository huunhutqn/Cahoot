FROM node:22-alpine AS base

# Enable and prepare pnpm via Corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# ----- DEPENDENCIES -----
FROM base AS deps
WORKDIR /app

# Copy package files
COPY pnpm-lock.yaml package.json ./

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# ----- BUILDER -----
FROM base AS builder
WORKDIR /app

# Copy all files
COPY . .

# Install all dependencies (including dev) for build
RUN pnpm install --frozen-lockfile

# Build Next.js app with standalone output
ENV NEXT_TELEMETRY_DISABLED=1

# Default to production socket URL (can be overridden at build time)
ARG SOCKET_URL=https://cahoot-socket.nhut95.me
ENV SOCKET_URL=${SOCKET_URL}

RUN pnpm build

# ----- RUNNER -----
FROM node:22-alpine AS runner
WORKDIR /app

# Create a non-root user for better security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the Next.js standalone build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Set correct permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

# Expose port
EXPOSE 3000

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start Next.js
CMD ["node", "server.js"]
