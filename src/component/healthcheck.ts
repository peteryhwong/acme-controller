import { getConnection } from '@ankh/ankh-db/lib/connection';
import { Status } from '@ankh/ankh-queue/lib/type';
import * as moment from 'moment-timezone';
import * as semver from 'semver';
import { Command } from '../entity/command';
import { Device } from '../entity/device';
import { isMasterProgramUpgrade, isPing } from './command';
import { API, EXCLUDE_DEVICES, INCLUDE_DEVICES, TIMEZONE } from './constant';
import { sendErrorMessage } from './integration/slack';
import { logger } from './logger';
import { sendDeviceMasterProgramUpgradeMessage, sendDeviceStatusMessage } from './message';
import { addDeviceHistory, getDevices, updateDevice } from './repository/device';
import { createCheckEvent } from './repository/event';
import { nextSchedule } from './schedule';

const UPGRADE_ALLOWED_DELAY_MINS = Number(API.poll.healthcheck.upgrade_allowed_delay_mins);
const HEALTHCHECK_INTERVAL_MINUTES = Number(API.poll.healthcheck.interval_mins);
const HEALTHCHECK_END_DATE_TIME = moment().tz(TIMEZONE).startOf('day').add(API.poll.healthcheck.end_time, 'minutes');
const HEALTHCHECK_START_DATE_TIME = moment().tz(TIMEZONE).startOf('day').add(1, 'day').add(API.poll.healthcheck.start_time, 'minutes');

export function timeDifferenceInMinutes(lhs: Date, rhs: Date) {
    const diff = lhs.getTime() - rhs.getTime();
    const diffMinutes = Math.floor(diff / 1000 / 60);
    return diffMinutes;
}

export function isLongPendingPing(command: Pick<Command, 'datetime' | 'detail' | 'status'>) {
    switch (command.status) {
        case 'pending':
            break;
        case 'acknowledged':
            return false;
    }

    if (!isPing(command.detail)) {
        return false;
    }

    // check if datetime is older than HEALTHCHECK_INTERVAL_MINUTES
    return timeDifferenceInMinutes(new Date(), command.datetime) > HEALTHCHECK_INTERVAL_MINUTES;
}

export async function changeDeviceStatus(device: Pick<Device, 'deviceId' | 'status' | 'datetime' | 'code' | 'masterProgramVersion' | 'location'>, status: Device['status']) {
    logger.info(`[changeDeviceStatus] device ${device.deviceId} status has become ${status}`);
    sendDeviceStatusMessage(device, status);
    logger.info(`[changeDeviceStatus] add device history for device ${device.deviceId}`);
    await addDeviceHistory({
        deviceId: device.deviceId,
        detail: {
            masterProgramVersion: device.masterProgramVersion,
            status: device.status,
        },
    });
    logger.info(`[changeDeviceStatus] update device status to ${status} for device ${device.deviceId}`);
    await updateDevice(device.deviceId, {
        status,
    });
}

export async function handleUnknownDevice(device: Pick<Device, 'deviceId' | 'status' | 'datetime' | 'code' | 'masterProgramVersion' | 'location'>) {
    if (device.status === 'unknown') {
        logger.info(`[handleUnknownDevice] device ${device.deviceId} is already unknown`);
        return false;
    }
    logger.info(`[handleUnknownDevice] device ${device.deviceId} status has become unknown`);
    await changeDeviceStatus(device, 'unknown');
    return true;
}

export async function handleOnlineDevice(device: Pick<Device, 'deviceId' | 'status' | 'datetime' | 'code' | 'masterProgramVersion' | 'location'>) {
    if (device.status !== 'unknown') {
        logger.info(`[handleOnlineDevice] device ${device.deviceId} is not unknown`);
        return false;
    }
    await changeDeviceStatus(device, 'online');
    return true;
}

export function handleUnattendedUpgrade(device: Pick<Device, 'deviceId' | 'code' | 'status' | 'command' | 'masterProgramVersion' | 'location'>) {
    if (device.status !== 'online') {
        return;
    }
    if (!device.command || device.command.length === 0) {
        return;
    }
    for (const command of device.command) {
        if (!isMasterProgramUpgrade(command.detail)) {
            continue;
        }
        if (device.masterProgramVersion && semver.gte(device.masterProgramVersion, command.detail.detail.VersionName)) {
            continue;
        }
        if (timeDifferenceInMinutes(new Date(), command.datetime) <= UPGRADE_ALLOWED_DELAY_MINS) {
            continue;
        }
        logger.info(`[handleUnattendedUpgrade] device ${device.deviceId} should be upgraded to ${command.detail.detail.VersionName} but is on ${device.masterProgramVersion}`);
        sendDeviceMasterProgramUpgradeMessage(device, command.detail.detail.VersionName);
    }
}

export async function nextHealthCheck(): Promise<Status> {
    try {
        const schedule = nextSchedule({
            intervalInMins: HEALTHCHECK_INTERVAL_MINUTES,
            start: HEALTHCHECK_START_DATE_TIME,
            end: HEALTHCHECK_END_DATE_TIME,
        });
        const event = await createCheckEvent(getConnection().createEntityManager(), 'healthcheck', schedule);
        logger.info(`[nextHealthCheck] scheduled next healthcheck ${event.eventId} for ${schedule.toISOString()}`);
        return 'processed';
    } catch (err) {
        logger.error(`[nextHealthCheck] error ${err.message}`);
        await sendErrorMessage(`[nextHealthCheck] error ${err.message}`);
        return 'error';
    }
}

// check if any device has not acked ping for 5 minute
export async function healthcheck(): Promise<Status> {
    const allDevices = await getDevices({ includeDeleted: false, relation: ['command', 'location'] });
    const devices = allDevices.filter(device => !EXCLUDE_DEVICES.includes(device.code)).filter(device => (INCLUDE_DEVICES.length > 0 ? INCLUDE_DEVICES.includes(device.code) : true));
    for (const device of devices) {
        logger.info(`[healthcheck] checking device ${device.deviceId}`);
        if (device.command.filter(isLongPendingPing).length === 0) {
            await handleOnlineDevice(device);
        } else {
            await handleUnknownDevice(device);
        }
    }
    return await nextHealthCheck();
}
