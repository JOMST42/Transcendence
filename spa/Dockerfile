FROM node:18.7-alpine

WORKDIR /spa

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --network-timeout 10000000
RUN npm install -g @angular/cli@14.2.1

COPY . .

RUN yarn start

EXPOSE 4200
