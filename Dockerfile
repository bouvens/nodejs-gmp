FROM node:14-alpine

ARG PORT
EXPOSE ${PORT}

WORKDIR /usr/src/app

COPY package*.json .
RUN npm ci --only=production

COPY . .
RUN npm run build

CMD node dist/index.js
