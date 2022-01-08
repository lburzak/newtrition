FROM node:14

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY .yarnrc.yml .
COPY .yarn/releases ./.yarn/releases
COPY .yarn/plugins ./.yarn/plugins
COPY packages/server-app/src ./packages/server-app/src
COPY packages/server-app/bin ./packages/server-app/bin
COPY packages/server-app/package.json ./packages/server-app
COPY packages/rest-client/lib ./packages/rest-client/lib
COPY packages/rest-client/package.json ./packages/rest-client

RUN yarn workspaces focus @newtrition/server-app --production

EXPOSE 4000
ENTRYPOINT ["yarn", "--cwd", "packages/server-app", "start"]