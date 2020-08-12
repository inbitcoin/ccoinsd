FROM node:12.18-buster-slim as builder

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ca-certificates git

ENV APP="/srv/app"

WORKDIR ${APP}

COPY app.js app.js
COPY ccutils.js ccutils.js
COPY config.js config.js
COPY expressapp.js expressapp.js
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY README.md README.md
COPY server.js server.js
COPY swagger.json swagger.json

RUN npm install --production && \
    npm cache clean --force

FROM node:12.18-buster-slim

ENV APP="/srv/app" USER="node"

RUN deluser ${USER} && \
    adduser --home ${APP} --shell /bin/bash --disabled-login \
        --gecos "${USER} user" ${USER}

COPY --from=builder --chown=${USER}:${USER} ${APP} ${APP}

EXPOSE 8080
USER ${USER}
WORKDIR ${APP}

ENTRYPOINT ["npm", "start"]
