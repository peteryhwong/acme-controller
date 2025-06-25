import { OpenAPIV3 as ExpressOpenAPIV3 } from 'express-openapi-validator/dist/framework/types';
import { OpenAPIV3 } from 'openapi-types';
import { components } from './components';
import paths from './paths';

import { Request } from 'express';
import { OpenApiValidatorOpts } from 'express-openapi-validator/dist/framework/types';
import * as path from 'path';
import { getVerifier } from '../component/authorisation';
import { hash } from '../component/hash';
import { logger } from '../component/logger';
import { getDeviceByCode } from '../component/repository/device';
import { addDeviceIdAndCodeToRequest } from '../component/request';

export const spec: OpenAPIV3.Document = {
    openapi: '3.0.0',
    servers: [
        {
            url: 'https://api-ext.acme-local.online:22233/controller',
        },
        {
            url: 'http://localhost:22223/controller',
        },
        {
            url: 'https://{environment}.acme-local.online/controller',
            variables: {
                environment: {
                    default: 'api-dev',
                    enum: ['api-dev', 'api'],
                },
            },
        },
    ],
    info: {
        version: '1.0',
        title: 'Controller Service',
        license: {
            name: 'ACME',
        },
    },
    paths,
    components,
};

export const openapi: OpenApiValidatorOpts = {
    apiSpec: spec as ExpressOpenAPIV3.Document,
    validateRequests: true,
    validateResponses: true,
    operationHandlers: path.join(__dirname, '../controller/'),
    validateSecurity: {
        handlers: {
            BearerAuth: async (req, roles, _schema) => {
                const response = await getVerifier().getSecurityHandler(roles)(req);
                if (typeof response !== 'boolean' && 'code' in response) {
                    throw { status: response.code, message: response.msg };
                } else if (typeof response === 'boolean') {
                    logger.info(`[openapi.validateSecurity.BearerAuth] No authentication ${req.method} request ${req.path}`);
                    return response;
                } else {
                    logger.info(`[openapi.validateSecurity.BearerAuth] ${response.username} ${req.method} request ${req.path}`);
                    return true;
                }
            },
            DeviceBasicAuth: async (req: Request, _roles, _schema) => {
                if (!req.headers || !req.headers.authorization) {
                    throw { status: 401, message: 'Invalid token' };
                }
                const authHeader = req.headers.authorization;
                const [username, passCode] = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
                const [code, group] = username.split('@');
                if (!code || !group) {
                    throw { status: 401, message: 'Invalid token' };
                }
                const device = await getDeviceByCode(code, group);
                if (!device) {
                    throw { status: 401, message: 'Invalid token' };
                }
                if (hash(`${code}${passCode}`) !== device.hash) {
                    throw { status: 401, message: 'Invalid token' };
                }
                logger.info(`[openapi.validateSecurity.DeviceBasicAuth] ${device.deviceId} ${req.method} request ${req.path}`);
                addDeviceIdAndCodeToRequest(req, device, group);
                return true;
            },
        },
    },
};
