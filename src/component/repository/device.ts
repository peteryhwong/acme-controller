import { getConnection } from '@ankh/ankh-db/lib/connection';
import { getEntitiesBy, getEntity, getEntityBy, QuerySpec, toRelationSpec, WhereSpec } from '@ankh/ankh-db/lib/util';
import { Device } from '../../entity/device';
import { DeviceHistory } from '../../entity/devicehistory';
import { Location } from '../../entity/location';
import { DeviceHistoryDetail } from '../../types/devicehistory';
import { hash } from '../hash';
import { logger } from '../logger';

export async function createDevice(device: { deviceCode: string; passCode: string; deviceType: string; location: Location }): Promise<Device> {
    const { deviceCode, passCode, deviceType, location } = device;
    return getConnection().transaction(async manager => {
        logger.info(`[createDevice] create device ${deviceCode}...`);
        const device = await manager.save(
            manager.create(Device, {
                code: deviceCode,
                type: deviceType,
                hash: hash(`${deviceCode}${passCode}`),
                location,
            }),
        );
        logger.info(`[createDevice] created device ${deviceCode}, deviceId: ${device.deviceId}`);
        return device;
    });
}

export function toQuerySpec(req: { code?: string[]; deviceId?: string[]; groups?: string[]; includeDeleted?: boolean; relation?: string[] }): QuerySpec {
    const { code, deviceId, groups, includeDeleted, relation = [] } = req;
    const relations = relation.map(toRelationSpec);
    const ids: WhereSpec[] = [];
    if (Array.isArray(code) && code.length > 0) {
        ids.push({
            identifierName: 'code',
            identifier: code,
        });
    }
    if (Array.isArray(deviceId) && deviceId.length > 0) {
        ids.push({
            identifierName: 'deviceId',
            identifier: deviceId,
        });
    }
    if (Array.isArray(groups) && groups.length > 0) {
        ids.push({
            identifierName: 'group',
            identifier: groups,
            entity: 'location',
        });
        if (!relation.includes('location')) {
            relations.push({
                name: 'location',
                inner: true,
            });
        }
    }
    return {
        ids,
        relations,
        includeDeleted,
    };
}

// get all devices
export async function getDevices(req: { groups?: string[]; includeDeleted?: boolean; relation?: string[] }): Promise<Device[]> {
    const { groups, includeDeleted = false, relation } = req;
    return getEntitiesBy(Device, toQuerySpec({ groups, includeDeleted, relation }));
}

// get device by deviceId
export function getDevice(req: { deviceId: string; groups?: string[]; relation?: string[] }): Promise<Device | null> {
    const { deviceId, groups, relation } = req;
    return getEntityBy(Device, toQuerySpec({ deviceId: [deviceId], groups, relation }));
}

export function getDeviceByCode(code: string, group: string, relation: string[] = []): Promise<Device | null> {
    return getEntityBy(Device, toQuerySpec({ code: [code], groups: [group], relation }));
}

export function getDeviceByHash(hash: string, relation: string[] = []): Promise<Device | null> {
    return getEntity(Device, { identifier: hash, identifierName: 'hash', relation });
}

// get device events by deviceId
export async function getDeviceWithEvents(req: { deviceId: string; groups?: string[] }): Promise<Device | null> {
    const { deviceId, groups } = req;
    return getEntityBy(Device, toQuerySpec({ deviceId: [deviceId], groups, relation: ['event'] }));
}

export function updateDevice(deviceId: string, update: Partial<Pick<Device, 'location' | 'deletedAt' | 'status' | 'masterProgramVersion'> & { password: string }>): Promise<Device> {
    return getConnection().transaction(async manager => {
        const device = await manager.findOneBy(Device, { deviceId });
        if (!device) {
            logger.error(`[updateDevice] device ${deviceId} not found`);
            throw new Error(`[updateDevice] device ${deviceId} not found`);
        }
        if (update.password) {
            device.hash = hash(`${device.code}${update.password}`);
        }
        if (update.location) {
            device.location = update.location;
        }
        device.status = update.status ?? device.status;
        device.deletedAt = update.deletedAt ?? device.deletedAt;
        device.masterProgramVersion = update.masterProgramVersion ?? device.masterProgramVersion;
        return manager.save(device);
    });
}

export async function addDeviceHistory(req: { deviceId: string; detail: DeviceHistoryDetail }) {
    const { detail, deviceId } = req;
    return await getConnection().transaction(async manager => {
        const device = await manager.findOne(Device, { where: { deviceId }, relations: ['deviceHistory'] });
        if (!device) {
            logger.error(`[addDeviceHistory]: device ${deviceId} not found`);
            throw new Error(`[addDeviceHistory]: device ${deviceId} not found`);
        }
        logger.info(`[addDeviceHistory]: add device history for device ${deviceId}`);
        const deviceHistory = await manager.save(
            manager.create(DeviceHistory, {
                detail,
                device,
            }),
        );
        device.deviceHistory.push(deviceHistory);
        return await manager.save(device);
    });
}
