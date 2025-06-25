import { Payload } from '@ankh/ankh-auth/lib/type';
import { IncomingMessage } from 'http';
import { Server } from 'net';
import { URL } from 'url';
import { WebSocket, WebSocketServer } from 'ws';
import { WebSocketMessage } from '../types/websocket';
import { getKey, getVerifier } from './authorisation';
import { APPLICATION_NAME } from './constant';
import { logger } from './logger';

const websocketServer: { server?: WebSocketServer } = {};

export async function verifyToken(req: Pick<IncomingMessage, 'url'>): Promise<Payload | undefined> {
    if (!req.url) {
        logger.error(`[verifyToken] WebSocket client connected with no url: ${req.url}`);
        return;
    }
    const token = new URL(req.url, 'http://localhost').searchParams.get('token');
    if (!token) {
        logger.error(`[verifyToken] WebSocket client connected with no token: ${req.url}`);
        return;
    }
    logger.info(`[verifyToken] WebSocket client connected with token: ${token.substring(0, 10)}...`);
    const result = await getVerifier().checkToken(['platform_user', 'platform_superuser', 'platform_report', 'platform_admin', 'hq_admin'], token, getKey);
    if ('code' in result) {
        logger.error(`[verifyToken] WebSocket client connected with invalid token`);
        return;
    } else {
        logger.info(`[verifyToken] WebSocket client connected with a valid token`);
        return result;
    }
}

const CLIENTS: Map<WebSocket, { groups?: string[]; userId: string }> = new Map();

export function createWebSocketServer(server: Server) {
    if (websocketServer.server) {
        logger.error('[createWebSocketServer] WebSocket server is already created');
        throw new Error('[createWebSocketServer] WebSocket server is already created');
    }
    websocketServer.server = new WebSocketServer({ server, path: `/${APPLICATION_NAME}/ws` });
    websocketServer.server.on('connection', (client, req) => {
        verifyToken(req).then(result => {
            const ip = req.socket.remoteAddress;
            if (!result) {
                logger.error(`[createWebSocketServer.connection] WebSocket client connected at ${ip} with an invalid token`);
                client.close();
                return;
            }
            const groups = result.group;
            const userId = result.userId;
            logger.info(`[createWebSocketServer.connection] WebSocket client connected at ${ip} with groups: ${groups ? groups.join(', ') : 'none'} and userId: ${userId}`);
            CLIENTS.set(client, { groups, userId });
            logger.info(`[createWebSocketServer.connection] WebSocket client connected: ${ip}`);
            client.on('close', () => {
                logger.info(`[createWebSocketServer.connection] WebSocket client disconnected: ${ip}`);
                const clientData = CLIENTS.get(client);
                CLIENTS.delete(client);
                if (!clientData) {
                    logger.warn(`[createWebSocketServer.connection] WebSocket client disconnected with no data`);
                    return;
                }
                logger.info(
                    `[createWebSocketServer.connection] WebSocket client disconnected with groups: ${clientData.groups ? clientData.groups.join(', ') : 'none'} and userId: ${clientData.userId}`,
                );
            });
        });
    });
    return `/${APPLICATION_NAME}/ws`;
}

export function getWebSocketServer() {
    if (!websocketServer.server) {
        logger.error('[getWebSocketServer] WebSocket server is not created');
        throw new Error('[getWebSocketServer] WebSocket server is not created');
    }
    return websocketServer.server;
}

export function sendMessage(message: WebSocketMessage) {
    const stringMessage = JSON.stringify(message);
    logger.info(`[sendMessage] Sending message: ${stringMessage}`);
    logger.info(`[sendMessage] Number of clients: ${CLIENTS.size}`);
    CLIENTS.forEach((clientData, client) => {
        if (!clientData.groups || clientData.groups.includes(message.group)) {
            if (client.readyState === WebSocket.OPEN) {
                logger.info(`[sendMessage] Sending message to client with groups: ${clientData.groups ? clientData.groups.join(', ') : 'none'} and userId: ${clientData.userId}`);
                client.send(stringMessage);
            }
        }
    });
}
