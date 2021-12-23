FROM node:14

WORKDIR /app

COPY src ./src
COPY bin ./bin
COPY package.json .
COPY ./.yalc ./.yalc

RUN yarn install --frozen-lockfile --production

EXPOSE 4000
ENTRYPOINT ["yarn", "start"]