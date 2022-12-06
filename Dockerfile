FROM node:alpine as development

WORKDIR /usr/src/app

COPY package*.json ./

COPY prisma ./prisma/

RUN npm install glob rimraf

RUN npm install -D

COPY . .

RUN npm run build

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

COPY prisma ./prisma/

RUN npm install glob rimraf

RUN npm install -D

COPY . .

COPY --from=development /usr/src/app/dist .dist/

CMD ["node", "dist/main"]