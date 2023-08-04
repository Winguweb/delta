FROM node:18.16-alpine AS dependencies

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn


##
FROM node:18.16-alpine AS build

WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN apk add --update --no-cache openssl
RUN yarn db:generate
RUN yarn build


###
FROM node:18.16-alpine AS deploy

WORKDIR /app

ENV NODE_ENV production

COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/prisma ./prisma/
COPY --from=build /app/server ./server
COPY --from=build /app/config ./config
EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
