import { Status } from '@ankh/ankh-queue/lib/type';
import * as semver from 'semver';
import { Command } from '../entity/command';
import { CommandDetail } from '../types/command';
import { components } from '../types/schema';
import { handleOnlineDevice } from './healthcheck';
import { logger } from './logger';
import { sendDeviceMasterProgramUpgradeMessage } from './message';
import { updateCommand, updateCommandsStatus } from './repository/command';
import { addDeviceHistory, getDevice, updateDevice } from './repository/device';
import { createDeviceEventInDb } from './repository/event';
import { updateJob } from './repository/job';

export function isPing(detail: CommandDetail): detail is components['schemas']['Ping'] {
    return 'command' in detail && detail.command === 'ping';
}

export function isMasterProgramUpgrade(detail: CommandDetail): detail is components['schemas']['MasterProgramUpgrade'] {
    return 'command' in detail && detail.command === 'masterprogramupgrade';
}

export function isJobDetail(detail: CommandDetail): detail is components['schemas']['JobDetail'] {
    return 'action' in detail && (detail.action === 'create' || detail.action === 'update');
}

export function isJobAction(detail: CommandDetail): detail is components['schemas']['JobAction'] {
    return 'action' in detail && detail.action !== 'create';
}

export function getCommandType(detail: CommandDetail): components['schemas']['Command']['type'] {
    if (isJobDetail(detail)) {
        return 1;
    } else if (isJobAction(detail)) {
        return 2;
    } else if (isPing(detail)) {
        return 3;
    } else if (isMasterProgramUpgrade(detail)) {
        return 4;
    }
    throw new Error(`[getCommandType]: invalid command detail ${JSON.stringify(detail)}`);
}

export async function processAcknowledgement(deviceId: string, acknowledgement: components['schemas']['Acknowledgement']): Promise<Status> {
    const { detail } = acknowledgement;
    logger.info(`[processAcknowledgement]: process acknowledgement for device ${deviceId}, detail: ${detail.commandId}`);
    const device = await getDevice({ deviceId, relation: ['command'] });
    if (!device) {
        logger.error(`[processAcknowledgement]: device not found`);
        throw new Error(`[processAcknowledgement]: device not found`);
    }
    // check and update version
    if (detail.version && !device.masterProgramVersion) {
        logger.info(`[processAcknowledgement]: device ${deviceId} version is ${detail.version}`);
        await addDeviceHistory({
            deviceId: device.deviceId,
            detail: {
                masterProgramVersion: device.masterProgramVersion,
                status: device.status,
            },
        });
        await updateDevice(deviceId, { masterProgramVersion: detail.version });
    } else if (detail.version && device.masterProgramVersion && semver.gt(detail.version, device.masterProgramVersion)) {
        logger.info(`[processAcknowledgement]: device ${deviceId} version is ${device.masterProgramVersion}, acknowledgement version is ${detail.version}`);
        await addDeviceHistory({
            deviceId: device.deviceId,
            detail: {
                masterProgramVersion: device.masterProgramVersion,
                status: device.status,
            },
        });
        await updateDevice(deviceId, { masterProgramVersion: detail.version });
    } else if (detail.version && device.masterProgramVersion && semver.lt(detail.version, device.masterProgramVersion)) {
        logger.info(`[processAcknowledgement]: device ${deviceId} version is ${device.masterProgramVersion}, acknowledgement version is ${detail.version}`);
        sendDeviceMasterProgramUpgradeMessage(device, detail.version);
    }
    for (const commandId of detail.commandId) {
        const command = device.command.find(command => command.commandId === commandId);
        if (!command) {
            logger.error(`[processAcknowledgement]: command not found`);
            throw new Error(`[processAcknowledgement]: command not found`);
        }
        logger.info(`[processAcknowledgement]: submit acknowledgement command ${commandId} for device ${deviceId}`);
        if (isPing(command.detail)) {
            logger.info(`[processAcknowledgement]: device ${deviceId} is online`);
            const handled = await handleOnlineDevice(device);
            if (!handled && device.status !== 'online') {
                await addDeviceHistory({
                    deviceId: device.deviceId,
                    detail: {
                        masterProgramVersion: device.masterProgramVersion,
                        status: device.status,
                    },
                });
                await updateDevice(deviceId, { status: 'online' });
            }
        } else if (isJobDetail(command.detail)) {
            logger.info(`[processAcknowledgement]: job ${command.detail.jobId} is in accepted`);
            await updateJob({
                jobId: command.detail.jobId,
                author: device.code,
                type: 'interim',
                update: {
                    status: 'standby',
                },
            });
        }
        await updateCommand(command.commandId, { status: 'acknowledged' });
    }
    return 'processed';
}

export async function acknowledgeCommand(request: {
    deviceId: string;
    body: components['schemas']['Acknowledgement'];
}): Promise<components['schemas']['Acknowledgement'] | components['schemas']['Error']> {
    try {
        const { deviceId, body } = request;
        const { detail, type } = body;
        const device = await getDevice({ deviceId, relation: ['command'] });
        if (!device) {
            logger.error(`[acknowledgeCommand]: device not found`);
            return { error_code: '404', error_message: 'Invalid' };
        }
        const existing = device.command.reduce<Record<string, Command>>((rs, command) => {
            rs[command.commandId] = command;
            return rs;
        }, {});
        const commandToAcknowledge: string[] = [];
        for (const commandId of Array.from(new Set(detail.commandId))) {
            const command = existing[commandId];
            if (!command) {
                logger.error(`[acknowledgeCommand]: some command not found`);
                return { error_code: '404', error_message: 'Invalid' };
            }
            if (command.status === 'pending') {
                logger.info(`[acknowledgeCommand]: submit acknowledgement command ${commandId} for device ${deviceId}`);
                commandToAcknowledge.push(commandId);
            } else {
                logger.info(`[acknowledgeCommand]: command ${commandId} for device ${deviceId} already acknowledged`);
            }
        }
        if (commandToAcknowledge.length > 0) {
            logger.info(`[acknowledgeCommand]: update commands ${commandToAcknowledge.join()} to pending-processing`);
            await updateCommandsStatus(commandToAcknowledge, 'pending-processing');
            logger.info(`[acknowledgeCommand]: submit acknowledgement command ${commandToAcknowledge.join()} for device ${deviceId}`);
            await createDeviceEventInDb(device, { detail: { version: detail.version, commandId: commandToAcknowledge }, type });
        }
        return {
            type,
            detail,
        };
    } catch (err) {
        logger.error(`[acknowledgeCommand] ${err.message}`);
        return { error_code: '500', error_message: 'Internal Server Error' };
    }
}
