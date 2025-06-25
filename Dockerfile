ARG BASE_IMAGE=nexus.ankh-local.com:5000/node:22.14.0-alpine3.20
FROM $BASE_IMAGE AS setup

WORKDIR /home/node/app
COPY package.json /home/node/app/
COPY package-lock.json /home/node/app/
COPY .npmrc /home/node/app/.npmrc

# Install dependencies
# /var/www/html/api installs dependencies
# /home/node/app installs devDependencies
ARG NEXUS_NPM_REGISTRY_ROOT_HOST=nexus.ankh-local.com/repository/
ARG NEXUS_NPM_REGISTRY_HOST=nexus.ankh-local.com/repository/npm-private
RUN --mount=type=secret,id=NEXUS_NPM_REGISTRY_ROOT_TOKEN \
    --mount=type=secret,id=NEXUS_NPM_REGISTRY_TOKEN \
    mkdir -p /tmp/cache && \
    npm config set strict-ssl false && \
    npm set //${NEXUS_NPM_REGISTRY_ROOT_HOST}:_authToken=$(cat /run/secrets/NEXUS_NPM_REGISTRY_ROOT_TOKEN) && \
    npm set //${NEXUS_NPM_REGISTRY_HOST}:_auth=$(cat /run/secrets/NEXUS_NPM_REGISTRY_TOKEN) && \
    npm ci --ignore-scripts --cache /tmp/cache && \
    mkdir -p /var/www/html/api && \
    cp /home/node/app/package.json /var/www/html/api/ &&\
    cp /home/node/app/package-lock.json /var/www/html/api/ &&\
    cp /home/node/app/.npmrc /var/www/html/api/ &&\
    cd /var/www/html/api && \
    npm ci --only=production --ignore-scripts --cache /tmp/cache && \
    rm -rf /tmp/cache && \
    npm config delete //${NEXUS_NPM_REGISTRY_ROOT_HOST}:_authToken && \
    npm config delete //${NEXUS_NPM_REGISTRY_HOST}:_auth

# Build and test
FROM $BASE_IMAGE AS build

COPY --from=setup /home/node/app /home/node/app

WORKDIR /home/node/app

COPY tsconfig.json /home/node/app/tsconfig.json
COPY src /home/node/app/src
COPY eslint.config.mjs /home/node/app/eslint.config.mjs
COPY jest.config.ts /home/node/app/jest.config.ts
COPY jest.setup.ts /home/node/app/jest.setup.ts
COPY .nvmrc /home/node/app/.nvmrc
COPY .prettierrc /home/node/app/.prettierrc
COPY .prettierignore /home/node/app/.prettierignore

# Test, audit and build
ARG SKIP_RUN_TEST
RUN if [ "$SKIP_RUN_TEST" != "true" ]; then npm run audit; fi && \
    if [ "$SKIP_RUN_TEST" != "true" ]; then npm run test; fi && \
    npm run build

# Deployment
FROM $BASE_IMAGE

# Build
WORKDIR /var/www/html/api

# Setting HKT time because MySQL is using HKT time
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Asia/Hong_Kong /etc/localtime && \
    echo "Asia/Hong_Kong" > /etc/timezone

# COPY production dependencies and code
COPY --from=setup /var/www/html/api /var/www/html/api
COPY --from=build /home/node/app/dist /var/www/html/api/dist

# Using the default port
EXPOSE 8080

# Set environment variables
ENV NODE_ENV=production
ENV TZ=Asia/Hong_Kong

CMD [ "node", "--max-old-space-size=2048", "dist/index.js" ]
