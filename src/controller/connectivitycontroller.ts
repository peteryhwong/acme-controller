import { Request, Response } from 'express';
import { authenticate } from '../component/authentication';
import { acknowledgeCommand, getCommandType } from '../component/command';
import { getDateForResponse } from '../component/date';
import { logger } from '../component/logger';
import { getCommands as getCommandsfromDb } from '../component/repository/command';
import { getDevice } from '../component/repository/device';
import { createDeviceEventInDb } from '../component/repository/event';
import { getDeviceIdAndCodeFromRequest } from '../component/request';
import { byDatetime } from '../component/sort';
import { components, operations } from '../types/schema';

export async function getCommandsWithKey(
    request: Request<any, any, any, any>,
    response: Response<operations['getCommandsWithKey']['responses']['200']['content']['application/json'] | components['schemas']['ConnectivityError']>,
) {
    try {
        const { device: deviceIdAndCode } = getDeviceIdAndCodeFromRequest(request);
        const { deviceId, code } = deviceIdAndCode;
        logger.info(`[getCommandsWithKey]: get commands for device ${deviceId} (code: ${code})`);
        const device = await getDevice({ deviceId });
        if (!device) {
            logger.error(`[getCommandsWithKey]: device not found`);
            response.status(404).json({ object: null, code: 404, message: 'Invalid' });
            return;
        }
        const commands = await getCommandsfromDb(device, ['pending']);
        logger.info(`[getCommandsWithKey]: found ${commands.length} commands`);
        response.status(200).json({
            code: 200,
            message: 'Commands found',
            object: {
                command: commands.sort(byDatetime).map(command => ({
                    id: command.commandId,
                    createDate: getDateForResponse(command.datetime),
                    command: command.detail,
                    type: getCommandType(command.detail),
                })),
            },
        });
    } catch (err) {
        logger.error(`[getCommandsWithKey] ${err.message}`);
        response.status(500).json({ object: null, code: 500, message: 'Internal Server Error' });
    }
}

// acknowledge command
export async function acknowledgeCommandWithKey(
    request: Request<any, any, operations['acknowledgeCommandWithKey']['requestBody']['content']['application/json'], any>,
    response: Response<operations['acknowledgeCommandWithKey']['responses']['200']['content']['application/json'] | components['schemas']['ConnectivityError']>,
) {
    try {
        const { device: deviceIdAndCode } = getDeviceIdAndCodeFromRequest(request);
        const { deviceId } = deviceIdAndCode;
        logger.info(`[acknowledgeCommandWithKey]: acknowledge command for device ${deviceId} with ${JSON.stringify(request.body)}`);
        const result = await acknowledgeCommand({ deviceId, body: request.body });
        if ('error_code' in result) {
            const code = Number(result.error_code);
            response.status(code).json({
                object: null,
                code,
                message: result.error_message,
            });
            return;
        }
        const { type, detail } = result;
        response.status(200).json({
            code: 200,
            message: 'Command acknowledged',
            object: {
                type,
                detail,
            },
        });
    } catch (err) {
        logger.error(`[acknowledgeCommandWithKey] ${err.message}`);
        response.status(500).json({ object: null, code: 500, message: 'Internal Server Error' });
    }
}

export async function createDeviceReportWithKey(
    request: Request<any, any, operations['createDeviceReportWithKey']['requestBody']['content']['application/json'], any>,
    response: Response<operations['createDeviceReportWithKey']['responses']['201']['content']['application/json'] | components['schemas']['ConnectivityError']>,
) {
    try {
        const { device: deviceIdAndCode } = getDeviceIdAndCodeFromRequest(request);
        const { deviceId } = deviceIdAndCode;
        const device = await getDevice({ deviceId });
        if (!device) {
            logger.error(`[createDeviceReportWithKey]: device not found`);
            response.status(404).json({ object: null, code: 404, message: 'Invalid device' });
            return;
        }
        const { detail: report } = request.body;
        const { eventId: reportId } = await createDeviceEventInDb(device, report);
        response.status(201).json({
            code: 201,
            message: 'Report created',
            object: {
                reportId,
            },
        });
    } catch (err) {
        logger.error(`[createDeviceReportWithKey] ${err.message}`);
        response.status(500).json({ object: null, code: 500, message: 'Internal Server Error' });
    }
}

export async function authentication(
    request: Request<any, any, operations['authentication']['requestBody']['content']['application/json'], any>,
    response: Response<operations['authentication']['responses']['200']['content']['application/json'] | components['schemas']['ConnectivityError']>,
) {
    try {
        const { device: deviceIdAndCode } = getDeviceIdAndCodeFromRequest(request);
        const { deviceId } = deviceIdAndCode;
        const device = await getDevice({ deviceId, relation: ['location'] });
        if (!device) {
            logger.error(`[authentication]: device not found`);
            response.status(404).json({ object: null, code: 404, message: 'Invalid device' });
            return;
        }
        const validation = await authenticate(request.body, device.location);
        if (!validation) {
            logger.error(`[authentication]: authentication failed for ${request.body.username}`);
            response.status(404).json({ object: null, code: 404, message: 'authentication failed' });
            return;
        }
        response.status(200).json({
            code: 200,
            message: 'Authentication successful',
            object: {
                valid: true,
                type: validation.type,
                role: validation.role,
            },
        });
    } catch (err) {
        logger.error(`[authentication] ${err.message}`);
        response.status(500).json({ object: null, code: 500, message: 'Internal Server Error' });
    }
}
