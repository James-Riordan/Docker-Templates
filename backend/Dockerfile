FROM node:14 as base

RUN mkdir -p /app

COPY package*.json /app/

COPY . /app/

WORKDIR /app

RUN npm i

RUN npm rebuild argon2 --build-from-source

RUN npm run build

ENV PORT=8000

CMD ["node", "dist/app.js"]