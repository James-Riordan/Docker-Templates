FROM node:14 as base

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm install argon2 --build-from-source

RUN npm run build

ENV PORT=8000

CMD ["node", "dist/app.js"]