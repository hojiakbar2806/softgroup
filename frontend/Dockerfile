# Bazaviy image uchun eng yengil va tez base
FROM node:20-alpine AS base

# Kerakli paketlarni o'rnatish uchun builder stage
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Dependency larni optimal o'rnatish
COPY package.json package-lock.json* ./
RUN npm ci

# Build uchun kerakli source codeni olish
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ENV o'zgaruvchilarini yangi formatda yozish
ENV NEXT_TELEMETRY_DISABLED=1

# Next.js configuration va build
RUN npm run build

# Minimal va eng tez runner
FROM base AS runner
WORKDIR /app

# Xavfsizlik va resurslarni tejash uchun user yaratish
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Kerakli fayllarni ko'chirish
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# ENV o'zgaruvchilarini yangi formatda yozish
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Foydalanuvchi va portni sozlash
USER nextjs
EXPOSE 3000

# Serverni ishga tushirish
CMD ["node", "server.js"]