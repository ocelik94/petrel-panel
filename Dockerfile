FROM node:25-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV DATABASE_URL=postgresql://placeholder:5432/placeholder
ENV ORIGIN=http://localhost:3000
ENV BETTER_AUTH_SECRET=build-placeholder

RUN npm run build
RUN npm prune --omit=dev

FROM node:25-alpine AS production

RUN addgroup -S petrel && adduser -S petrel -G petrel

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE 3000

USER petrel

CMD ["node", "build/index.js"]
