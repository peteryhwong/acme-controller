ARG BASE_IMAGE=nexus.ankh-local.com:5001/ankh/node-test-base:latest
FROM $BASE_IMAGE

# Copy source code
WORKDIR /home/node/app
COPY package.json /home/node/app/
COPY package-lock.json /home/node/app/
COPY tsconfig.json /home/node/app/

RUN npm ci

COPY jest.config.ts /home/node/app/jest.config.ts
COPY resource /home/node/app/resource
COPY test /home/node/app/test
