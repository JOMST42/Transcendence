
FROM node:18.7-alpine

WORKDIR /api

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN npx prisma generate
RUN yarn build

EXPOSE 3000
