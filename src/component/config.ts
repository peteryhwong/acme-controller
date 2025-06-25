import { initialiseDb } from '@ankh/ankh-db/lib/db';
import { ServerSpec, ServerSpecPost } from '@ankh/ankh-http/lib/type';

import { getConnection, setConnection } from '@ankh/ankh-db/lib/connection';
import { openapi } from '../openapi';
import { APPLICATION_NAME, ENVIRONMENT, NO_POLL, NODE_ENV, PORT } from './constant';
import { dbConfig } from './db';
import { errorformat } from './error';
import { eventProcessor } from './eventprocessor';
import { logger, loggerMiddleware } from './logger';

const post: ServerSpecPost = async () => {
    logger.info(`[post] initialising db connection`);
    const [connection] = await initialiseDb(dbConfig, NODE_ENV === 'production');
    logger.info(`[post] initialised db connection`);
    setConnection(connection);
};

const prefix = `/${APPLICATION_NAME}`;
export const healthCheckPath = `${prefix}/healthcheck`;
export const serverSpec: ServerSpec = {
    openapi,
    openapiDocsPathPrefix: prefix,
    openapiDocs: ENVIRONMENT === 'production' ? false : true,
    applicationName: APPLICATION_NAME,
    env: NODE_ENV || 'test',
    defaultMiddlewares: [loggerMiddleware],
    logger,
    port: Number(PORT),
    routes: [],
    ssl: undefined,
    errorformat,
    post,
    onTermination: async () => {
        if (!NO_POLL) {
            logger.info(`[onTermination] shut down task processor`);
            await eventProcessor.shutDown();
        }
    },
    onTerminationAfterSocketClosed: async () => {
        logger.info(`[onTerminationAfterSocketClosed] shut down db connection`);
        await getConnection().destroy();
    },
    accessControlAllowedDomains: ['localhost', 'ankh-local.com', 'ankh.com.hk', 'acme-local.online'],
    serverShutDown: {
        waitServerCloseMs: 1000,
        tryServerClose: 1,
        waitConnectionCloseMs: 500,
        tryConnectionClose: 3,
    },
    healthValidator: async () => {
        await getConnection().query(`select 1`);
        return true;
    },
};
