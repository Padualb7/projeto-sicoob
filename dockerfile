# Etapa 1: build da aplicação
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build


# Etapa 2: execução da aplicação SSR
FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

COPY package.json package-lock.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist/outros-creditos-debitos ./dist/outros-creditos-debitos

EXPOSE 4000

CMD ["node", "dist/outros-creditos-debitos/server/server.mjs"]