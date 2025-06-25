import { getGroupsFromReq } from '@ankh/ankh-auth/lib/helpers';
import { Request, Response } from 'express';
import { getCommandType, isMasterProgramUpgrade } from '../component/command';
import { getDateForResponse } from '../component/date';
import { logger } from '../component/logger';
import { createCommand, getCommands as getCommandsfromDb } from '../component/repository/command';
import { getDevice } from '../component/repository/device';
import { byDatetime } from '../component/sort';
import { components, operations } from '../types/schema';

export async function getCommands(
    request: Request<operations['getCommands']['parameters']['path'], any, any, operations['getCommands']['parameters']['query']>,
    response: Response<operations['getCommands']['responses']['200']['content']['application/json'] | components['schemas']['Error']>,
) {
    const deviceId = request.params.deviceId;
    const status = request.query.status;
    logger.info(`[getCommands]: get ${(status ?? []).join()} commands for device ${deviceId}`);
    const device = await getDevice({ deviceId, groups: getGroupsFromReq(request) });
    if (!device) {
        logger.error(`[getCommands]: device not found`);
        response.status(404).json({ error_code: '404', error_message: 'Invalid' });
        return;
    }
    const commands = await getCommandsfromDb(device, status);
    logger.info(`[getCommands]: found ${commands.length} commands`);
    response.status(200).json({
        command: commands.sort(byDatetime).map(({ commandId, datetime, detail, status }) => ({
            id: commandId,
            createDate: getDateForResponse(datetime),
            command: detail,
            status,
            type: getCommandType(detail),
        })),
    });
}

// create command
export async function sendCommand(
    request: Request<operations['sendCommand']['parameters']['path'], any, operations['sendCommand']['requestBody']['content']['application/json'], any>,
    response: Response<operations['sendCommand']['responses']['201']['content']['application/json'] | components['schemas']['Error']>,
) {
    const deviceId = request.params.deviceId;
    const { command } = request.body;
    // do not allow upgrade command to be sent through this api
    if (isMasterProgramUpgrade(command)) {
        logger.error(`[sendCommand]: upgrade command is not allowed to be sent through this api`);
        response.status(400).json({ error_code: '400', error_message: 'Invalid' });
        return;
    }
    logger.info(`[sendCommand]: send command for device ${deviceId}`);
    const device = await getDevice({ deviceId, groups: getGroupsFromReq(request) });
    if (!device) {
        logger.error(`[sendCommand]: device not found`);
        response.status(404).json({ error_code: '404', error_message: 'Invalid' });
        return;
    }
    const { commandId } = await createCommand(device, command);
    logger.info(`[sendCommand]: created command ${commandId}`);
    response.status(201).json({
        commandId,
    });
}
