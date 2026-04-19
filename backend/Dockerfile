FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./tsconfig.json
COPY src ./src
COPY docs ./docs
COPY scripts ./scripts

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=base /app/build ./build
COPY --from=base /app/docs ./docs
EXPOSE 3555
CMD ["node", "build/app.js"]
