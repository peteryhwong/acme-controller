import { getConnection } from '@ankh/ankh-db/lib/connection';
import { updateEntity, updateEntities } from '@ankh/ankh-db/lib/util';
import { Command } from '../../entity/command';
import { Device } from '../../entity/device';
import { Job } from '../../entity/job';
import { CommandDetail } from '../../types/command';
import { logger } from '../logger';

export function getCommands(device: Device, status?: Command['status'][]): Promise<Command[]> {
    logger.info(`[getCommands]: get commands for device ${device.deviceId}`);
    let builder = getConnection().createQueryBuilder(Command, 'command').innerJoin('command.device', 'device').where('device.deviceId = :deviceId', { deviceId: device.deviceId });
    if (Array.isArray(status) && status.length > 0) {
        builder = builder.andWhere('command.status IN (:...status)', { status });
    }
    return builder.getMany();
}

// update command in db
export function updateCommand(commandId: string, update: Pick<Command, 'status'>): Promise<Command> {
    logger.info(`[updateCommand]: update command ${commandId}`);
    return updateEntity(Command, { identifierName: 'commandId', identifier: commandId, data: update });
}

// update status of multiple commands in db by ids
export function updateCommandsStatus(commandIds: string[], status: Command['status']): Promise<Command[]> {
    logger.info(`[updateCommandsStatus]: update commands ${commandIds.join()} to status ${status}`);
    return updateEntities(Command, { identifierName: 'commandId', identifier: commandIds, data: { status } });
}

// create command in db
export function createCommand(device: Device, data: CommandDetail, job?: Job): Promise<Pick<Command, 'commandId'>> {
    logger.info(`[createCommand]: create command for device ${device.deviceId}`);
    return getConnection().getRepository(Command).save({
        detail: data,
        device,
        job,
    });
}
