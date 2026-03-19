# Frontend Dockerfile
FROM node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --production=false

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Exclude backend folders from build
ENV NODE_ENV production
ARG NEXT_PUBLIC_API_URL_PROD
ARG NEXT_PUBLIC_API_URL_LOCAL=http://localhost:5000/api
ENV NEXT_PUBLIC_API_URL_PROD=$NEXT_PUBLIC_API_URL_PROD
ENV NEXT_PUBLIC_API_URL_LOCAL=$NEXT_PUBLIC_API_URL_LOCAL

RUN mkdir -p public
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["npm", "start"]
