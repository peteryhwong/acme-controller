import { getGroupsFromReq, hasGroup } from '@ankh/ankh-auth/lib/helpers';
import { Request, Response } from 'express';
import * as semver from 'semver';
import { HQ_GROUP } from '../component/constant';
import { getDateForResponse } from '../component/date';
import { toEventResponseDetail } from '../component/event';
import oss from '../component/integration/oss';
import { logger } from '../component/logger';
import { deviceLocalAdminAssigneeUsername, deviceLocalUser } from '../component/offline';
import { createAssignee } from '../component/repository/assignee';
import { createCommand } from '../component/repository/command';
import { addDeviceHistory, createDevice as createDeviceInDatabase, getDevice, getDeviceByCode, getDevices, getDeviceWithEvents, updateDevice } from '../component/repository/device';
import { getLocationById } from '../component/repository/location';
import { createUser } from '../component/repository/user';
import { byDatetime } from '../component/sort';
import { components, operations } from '../types/schema';

export async function createDevice(
    request: Request<any, any, operations['createDevice']['requestBody']['content']['application/json'], any>,
    response: Response<operations['createDevice']['responses']['201']['content']['application/json'] | components['schemas']['Error']>,
) {
    try {
        const { code, type, locationId, password: passcode } = request.body;
        const location = await getLocationById(locationId);
        if (!location) {
            logger.error(`[createDevice] location ${locationId} not found`);
            response.status(400).json({ error_code: '400', error_message: 'Location not found' });
            return;
        }
        if (!hasGroup([HQ_GROUP])(request, location.group)) {
            logger.error(`[createDevice] user does not have permission to create device at ${location.name}`);
            response.status(403).json({ error_code: '403', error_message: 'Forbidden' });
            return;
        }
        const exist = await getDeviceByCode(code, location.group);
        if (exist) {
            logger.error(`[createDevice] device ${code} already exists`);
            response.status(400).json({ error_code: '400', error_message: 'Device already exists' });
            return;
        }
        logger.info(`[createDevice] create device ${code} of type ${type} at ${locationId}`);
        const device = await createDeviceInDatabase({
            deviceCode: code,
            deviceType: type,
            passCode: passcode,
            location,
        });
        logger.info(`[createDevice] created device ${device.deviceId}`);
        // create a local default assignee for the device
        const localAssignessUsername = deviceLocalAdminAssigneeUsername(device.deviceId);
        logger.info(`[createDevice] create local assignee ${localAssignessUsername} for device ${code}`);
        await createAssignee({
            username: localAssignessUsername,
            passcode: localAssignessUsername,
            role: 'device_admin',
            location,
            keepcasing: true,
            type: 'internal',
        });
        // create a local default user for the device
        const localUserUsername = deviceLocalUser(device.deviceId);
        logger.info(`[createDevice] create local user ${localUserUsername} for device ${code}`);
        await createUser({
            name: localUserUsername,
            userNumber: localUserUsername,
            location,
            type: 'internal',
        });
        const command = await createCommand(device, { command: 'ping' });
        logger.info(`[createDevice] created command ${command.commandId}`);
        response.status(201).json({
            deviceId: device.deviceId,
        });
    } catch (err) {
        logger.error(`[createDevice]: ${err.message}`);
        response.status(500).json({ error_code: '500', error_message: 'Internal Server Error' });
    }
}

export async function getDeviceById(
    request: Request<operations['getDeviceById']['parameters']['path']>,
    response: Response<operations['getDeviceById']['responses']['200']['content']['application/json'] | components['schemas']['Error']>,
) {
    try {
        const { deviceId } = request.params;
        logger.info(`[getDeviceById] get device ${deviceId}`);
        const device = await getDevice({ deviceId, groups: getGroupsFromReq(request), relation: ['location', 'deviceHistory'] });
        if (!device) {
            logger.error(`[getDeviceById] device ${deviceId} not found`);
            response.status(404).json({ error_code: '404', error_message: 'Device not found' });
            return;
        }
        logger.info(`[getDeviceById] found device ${device.deviceId}`);
        response.status(200).json({
            deviceId: device.deviceId,
            code: device.code,
            type: device.type,
            status: device.status,
            masterProgramVersion: device.masterProgramVersion ?? 'unknown',
            locationId: device.location?.locationId ?? '',
            deviceHistory: device.deviceHistory.sort(byDatetime).map(history => ({
                datetime: getDateForResponse(history.datetime),
                detail: {
                    ...history.detail,
                    masterProgramVersion: history.detail.masterProgramVersion ?? 'unknown',
                },
            })),
        });
    } catch (err) {
        logger.error(`[getDeviceById]: ${err.message}`);
        response.status(500).json({ error_code: '500', error_message: 'Internal Server Error' });
    }
}

export async function listDevices(
    request: Request<any, any, any, operations['listDevices']['parameters']['query']>,
    response: Response<operations['listDevices']['responses']['200']['content']['application/json'] | components['schemas']['Error']>,
) {
    try {
        const { includeDeleted } = request.query;
        logger.info(`[listDevices] list all devices (includeDeleted: ${includeDeleted})`);
        const devices = await getDevices({ groups: getGroupsFromReq(request), relation: ['location'], includeDeleted });
        logger.info(`[listDevices] found ${devices.length} devices`);
        response.status(200).json({
            devices: devices.map(device => ({
                deviceId: device.deviceId,
                code: device.code,
                type: device.type,
                status: device.status,
                masterProgramVersion: device.masterProgramVersion ?? 'unknown',
                locationId: device.location?.locationId ?? '',
                deviceHistory: [],
            })),
        });
    } catch (err) {
        logger.error(`[listDevices]: ${err.message}`);
        response.status(500).json({ error_code: '500', error_message: 'Internal Server Error' });
    }
}

export async function updateDevicePassword(
    request: Request<operations['updateDevicePassword']['parameters']['path'], any, operations['updateDevicePassword']['requestBody']['content']['application/json'], any>,
    response: Response<operations['updateDevicePassword']['responses']['200']['content']['application/json'] | components['schemas']['Error']>,
) {
    try {
        const { deviceId } = request.params;
        logger.info(`[updateDevicePassword] get device ${deviceId}`);
        const device = await getDevice({ deviceId, groups: getGroupsFromReq(request) });
        if (!device) {
            logger.error(`[updateDevicePassword] device ${deviceId} not found`);
            response.status(404).json({ error_code: '404', error_message: 'Device not found' });
            return;
        }
        const { password } = request.body;
        logger.info(`[updateDevicePassword] update device ${deviceId} password`);
        const { hash } = device;
        const updated = await updateDevice(device.deviceId, {
            password,
        });
        logger.info(`[updateDevicePassword] updated device ${deviceId} password`);
        if (hash !== updated.hash) {
            logger.info(`[updateDevicePassword] device ${deviceId} password changed`);
            await addDeviceHistory({
                deviceId: device.deviceId,
                detail: {
                    passwordUpdated: true,
                    status: device.status,
                    masterProgramVersion: device.masterProgramVersion,
                },
            });
        }
        response.status(200).json({
            deviceId,
        });
    } catch (err) {
        logger.error(`[updateDevicePassword]: ${err.message}`);
        response.status(500).json({ error_code: '500', error_message: 'Internal Server Error' });
    }
}

// update device location
export async function updateDeviceLocation(
    request: Request<operations['updateDeviceLocation']['parameters']['path'], any, operations['updateDeviceLocation']['requestBody']['content']['application/json'], any>,
    response: Response<operations['updateDeviceLocation']['responses']['200']['content']['application/json'] | components['schemas']['Error']>,
) {
    try {
        const { deviceId } = request.params;
        logger.info(`[updateDeviceLocation] get device ${deviceId}`);
        const device = await getDevice({ deviceId, groups: getGroupsFromReq(request), relation: ['location'] });
        if (!device) {
            logger.error(`[updateDeviceLocation] device ${deviceId} not found`);
            response.status(404).json({ error_code: '404', error_message: 'Device not found' });
            return;
        }
        const { locationId } = request.body;
        logger.info(`[updateDeviceLocation] get location ${locationId}`);
        const location = await getLocationById(locationId);
        if (!location) {
            logger.error(`[updateDeviceLocation] location ${locationId} not found`);
            response.status(404).json({ error_code: '404', error_message: 'Location not found' });
            return;
        }
        if (location.group !== device.location?.group) {
            logger.error(`[updateDeviceLocation] device ${deviceId} cannot move to location ${locationId} because it is not in the same group`);
            response.status(403).json({ error_code: '403', error_message: 'Forbidden' });
            return;
        }
        logger.info(`[updateDeviceLocation] update device ${deviceId} location`);
        await updateDevice(device.deviceId, {
            location,
        });
        logger.info(`[updateDeviceLocation] updated device ${deviceId} location`);
        response.status(200).json({
            deviceId: device.deviceId,
        });
    } catch (err) {
        logger.error(`[updateDeviceLocation]: ${err.message}`);
        response.status(500).json({ error_code: '500', error_message: 'Internal Server Error' });
    }
}

// soft delete device by deviceId
export async function deleteDevice(
    request: Request<operations['deleteDevice']['parameters']['path']>,
    response: Response<operations['deleteDevice']['responses']['200']['content']['application/json'] | components['schemas']['Error']>,
) {
    try {
        const { deviceId } = request.params;
        logger.info(`[deleteDevice] delete device ${deviceId}`);
        const device = await getDevice({ deviceId, groups: getGroupsFromReq(request) });
        if (!device) {
            logger.error(`[deleteDevice] device ${deviceId} not found`);
            response.status(404).json({ error_code: '404', error_message: 'Device not found' });
            return;
        }
        logger.info(`[deleteDevice] delete device ${deviceId}`);
        await addDeviceHistory({
            deviceId: device.deviceId,
            detail: {
                masterProgramVersion: device.masterProgramVersion,
                status: 'offline',
            },
        });
        await updateDevice(device.deviceId, {
            deletedAt: new Date(),
            status: 'offline',
        });
        logger.info(`[deleteDevice] deleted device ${deviceId}`);
        response.status(200).json({
            deviceId: device.deviceId,
        });
    } catch (err) {
        logger.error(`[deleteDevice]: ${err.message}`);
        response.status(500).json({ error_code: '500', error_message: 'Internal Server Error' });
    }
}

export async function listDeviceEvents(
    request: Request<operations['listDeviceEvents']['parameters']['path']>,
    response: Response<operations['listDeviceEvents']['responses']['200']['content']['application/json'] | components['schemas']['Error']>,
) {
    try {
        const { deviceId } = request.params;
        logger.info(`[listDeviceEvents] list all events for device ${deviceId}`);
        const device = await getDeviceWithEvents({ deviceId, groups: getGroupsFromReq(request) });
        if (!device) {
            logger.error(`[listDeviceEvents] device ${deviceId} not found`);
            response.status(404).json({ error_code: '404', error_message: 'Device not found' });
            return;
        }
        if (!Array.isArray(device.event)) {
            logger.error(`[listDeviceEvents] device ${deviceId} has no events`);
            response.status(404).json({ error_code: '404', error_message: 'Device has no events' });
            return;
        }
        logger.info(`[listDeviceEvents] found ${device.event.length} events for device ${deviceId}`);
        response.status(200).json({
            event: device.event.sort(byDatetime).map(event => ({
                datetime: getDateForResponse(event.datetime),
                detail: toEventResponseDetail(event.detail),
                eventId: event.eventId,
                type: event.type,
                status: event.status,
                deviceId: device.deviceId,
            })),
        });
    } catch (err) {
        logger.error(`[listDeviceEvents]: ${err.message}`);
        response.status(500).json({ error_code: '500', error_message: 'Internal Server Error' });
    }
}

// send a master program update command to a device
export async function updateDeviceMasterProgram(
    request: Request<operations['updateDeviceMasterProgram']['parameters']['path'], any, operations['updateDeviceMasterProgram']['requestBody']['content']['application/json'], any>,
    response: Response<operations['updateDeviceMasterProgram']['responses']['200']['content']['application/json'] | components['schemas']['Error']>,
) {
    try {
        const { deviceId } = request.params;
        const { version } = request.body;
        logger.info(`[updateDeviceMasterProgram] update device ${deviceId} master program to ${version}`);
        const device = await getDevice({ deviceId, groups: getGroupsFromReq(request) });
        if (!device) {
            logger.error(`[updateDeviceMasterProgram] device ${deviceId} not found`);
            response.status(404).json({ error_code: '404', error_message: 'Device not found' });
            return;
        }
        // do not upgrade if the device is offline
        if (device.status === 'offline') {
            logger.error(`[updateDeviceMasterProgram] device ${deviceId} is offline`);
            response.status(400).json({ error_code: '400', error_message: 'Device is offline' });
            return;
        }
        // do not upgrade if the device is online and has the same or higher version
        if (device.masterProgramVersion && semver.gte(device.masterProgramVersion, version)) {
            logger.error(`[updateDeviceMasterProgram] device ${deviceId} has the same or higher version`);
            response.status(400).json({ error_code: '400', error_message: 'Device is has the same or higher version' });
            return;
        }
        const program = `masterprogram/version/${version}/masterprogram.apk`;
        const details = await oss.listObjectDetails('acme-repository', program);
        if (details.length === 0) {
            logger.error(`[updateDeviceMasterProgram] master program ${version} not found`);
            response.status(404).json({ error_code: '404', error_message: 'Master program not found' });
            return;
        }
        const { size, etag } = details[0];

        // generate a presigned link for the apk to send to as command
        logger.info(`[updateDeviceMasterProgram] generate presigned link for ${version}`);
        const url = await oss.generatePresignedUrl('acme-repository', `masterprogram/version/${version}/masterprogram.apk`);
        logger.info(`[updateDeviceMasterProgram] generated presigned link for ${version}`);
        await createCommand(device, {
            command: 'masterprogramupgrade',
            detail: {
                VersionCode: version.replace(/\D/g, ''),
                VersionName: version,
                DownloadUrl: url,
                ApkMd5: etag.replace(/"/g, ''),
                ApkSize: size.toString(),
                ModifyContent: `Upgrade to version ${version}`,
            },
        });
        response.status(200).json({
            version,
        });
    } catch (err) {
        logger.error(`[updateDeviceMasterProgram]: ${err.message}`);
        response.status(500).json({ error_code: '500', error_message: 'Internal Server Error' });
    }
}
