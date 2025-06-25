import 'reflect-metadata';

import { createHttpServer } from '@ankh/ankh-http/lib/httpserver';
import * as v8 from 'v8';

import { serverSpec } from './component/config';
import { LOGLEVEL, NO_POLL, QUEUE_POLLING_INTERVAL_MS } from './component/constant';
import { eventProcessor } from './component/eventprocessor';
import { logger } from './component/logger';
import { createWebSocketServer } from './component/websocket';

async function setUpServer() {
    const { server } = await createHttpServer(serverSpec);
    logger.info(`[setUpServer] Created server`);
    const path = createWebSocketServer(server);
    logger.info(`[setUpServer] Created WebSocket server at ws://localhost:${serverSpec.port}${path}`);
}

setUpServer().then(() => {
    if (LOGLEVEL === 'DEBUG') {
        const totalHeapSizeInGB = (v8.getHeapStatistics().total_available_size / 1024 / 1024 / 1024).toFixed(2);
        console.log(`*******************************************`);
        console.log(`Total Heap Size ~${totalHeapSizeInGB}GB`);
        console.log(`*******************************************`);
    }
    if (NO_POLL) {
        logger.info(`Polling is disabled, processing requires manual trigger`);
    } else {
        logger.info(`Start processing, polling every ${QUEUE_POLLING_INTERVAL_MS}ms`);
        eventProcessor.process();
    }
});
