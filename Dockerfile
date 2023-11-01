FROM node:16

ENV PORT 2567

WORKDIR /colyseus-app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm i -g yarn --force
RUN yarn install

COPY . .

EXPOSE 2567

CMD [ "yarn", "build" ]
CMD [ "node", "lib/index.js" ]