FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json .
RUN npm ci --only=production

COPY ./src/module1/task1.2.js .
COPY ./csv ./csv

CMD node task1.2.js
