FROM node:latest

WORKDIR /usr/src/app

COPY dist /usr/src/app

RUN yarn install --production

CMD ["node", "bootstrap.js"]
