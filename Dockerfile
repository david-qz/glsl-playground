FROM node:20-alpine AS build

WORKDIR /build

COPY . .

RUN npm ci
RUN npm run build
RUN npm prune --omit=dev

#################################################

FROM node:20-alpine

WORKDIR /app

COPY --from=build /build/node_modules node_modules
COPY --from=build /build/package.json package.json
COPY --from=build /build/dist dist
COPY --from=build /build/public public
COPY --from=build /build/sql sql

CMD [ "node", "dist/server.cjs" ]
