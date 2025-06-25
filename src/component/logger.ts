import { getLogger } from '@ankh/ankh-logger/lib/getLogger';
import { NextFunction, Request, Response } from 'express';

import { APPLICATION_NAME, LOGLEVEL, NODE_ENV } from './constant';

export const logger = getLogger({
    applicationName: APPLICATION_NAME,
    logLevel: LOGLEVEL,
    silent: NODE_ENV === 'test',
    legacy: true,
});

export const loggerMiddleware = (req: Request, res?: Response, next?: NextFunction) => {
    logger.info(`[logger.loggerMiddleware] Receive ${req.method} request ${req.path}`);
    if (next) {
        next();
    }
};
