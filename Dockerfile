FROM node:12

WORKDIR /usr/src/app

RUN yarn global add @babel/cli

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn babel src --out-dir dist

CMD [ "node", "dist/index.js" ]