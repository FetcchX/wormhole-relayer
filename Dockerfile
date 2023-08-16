FROM node:alpine

WORKDIR /app

COPY ./package.json package.json

RUN npm i

COPY . .

RUN npm run build

CMD node ./dist/index.js