FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json .
RUN npm ci --only=production

COPY . .
RUN npm run build

ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/index.js"]
