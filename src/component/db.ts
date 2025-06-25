import { DbConfig } from '@ankh/ankh-db/lib/type';
import { resolve } from 'path';
import { API, LOGLEVEL, DB_HOST } from './constant';
import { logger } from './logger';

export const dbConfig: DbConfig = {
    config: {
        host: DB_HOST,
        port: Number(API.db.port),
        username: API.db.username,
        password: API.db.password,
        database: API.db.dbname,
    },
    type: 'mysql',
    enforceSSL: false,
    createSchema: false,
    runMigration: true,
    logger,
    entitiesDir: resolve(__dirname, '../entity'),
    migrationsDir: resolve(__dirname, '../migration'),
    subscribersDir: resolve(__dirname, '../subscriber'),
    logLevel: LOGLEVEL,
    callback: async () => {
        logger.info(`Exit migration app`);
    },
};
