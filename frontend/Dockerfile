# 1. Bazaviy Node.js image'dan foydalanamiz
FROM node:18-alpine AS base

# 2. Faqat kerakli joyda dependencies o'rnatamiz
FROM base AS deps

WORKDIR /app

# Dependencies o'rnatish
COPY package.json package-lock.json ./
RUN npm ci

# 3. Faqat kerakli vaqtda source code'ni qayta quramiz
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js telemetry'ni o'chirib qo'yamiz
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# 4. Production uchun image, barcha fayllarni nusxalash va Next.js ishga tushirish
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Telemetry'ni o'chirib qo'yamiz
ENV NEXT_TELEMETRY_DISABLED=1

RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Prerender cache uchun to'g'ri ruxsatlar o'rnatish
RUN mkdir .next
RUN chown nextjs:node .next

# Output tracing orqali image hajmini kamaytirish
COPY --from=builder --chown=nextjs:node /app/.next/standalone ./
COPY --from=builder --chown=nextjs:node /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

# Hostname'ni localhost'ga o'rnatish
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
