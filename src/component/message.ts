import { Device } from '../entity/device';
import { Job } from '../entity/job';
import { JobDifference } from '../types/job';
import { sendDeviceErrorMessage } from './integration/slack';
import { logger } from './logger';
import { sendMessage } from './websocket';

export async function sendJobAnonmalyMessage(device: Pick<Device, 'deviceId' | 'code' | 'location'>, message: string, jobId?: string) {
    logger.info(`[sendJobAnonmalyMessage] handle job anomaly for device ${device.code}`);
    sendMessage({
        type: 'job',
        group: device.location.group,
        payload: {
            deviceId: device.deviceId,
            deviceCode: device.code,
            jobId: jobId,
            detail: message,
        },
    });
    sendDeviceErrorMessage(`[sendJobAnonmalyMessage] device ${device.code}(${jobId}) has anomaly: ${message}`);
}

export async function sendJobDifferenceMessage(device: Pick<Device, 'deviceId' | 'code' | 'location'>, job: Pick<Job, 'status' | 'jobId'>, jobDifference: JobDifference[]) {
    logger.info(`[sendJobDifferenceMessage] handle job difference ${job.jobId}`);
    sendMessage({
        type: 'job',
        group: device.location.group,
        payload: {
            deviceId: device.deviceId,
            deviceCode: device.code,
            jobId: job.jobId,
            status: job.status,
            detail: jobDifference,
        },
    });
    sendDeviceErrorMessage(`[sendJobDifferenceMessage] job ${job.jobId} has difference: ${JSON.stringify(jobDifference)}`);
}

export async function sendDeviceStatusMessage(device: Pick<Device, 'deviceId' | 'status' | 'code' | 'location'>, status: Device['status']) {
    logger.info(`[sendDeviceStatusMessage] device ${device.deviceId} status has become ${status}`);
    sendMessage({
        type: 'device',
        group: device.location.group,
        payload: {
            deviceId: device.deviceId,
            deviceCode: device.code,
            status,
        },
    });
    sendDeviceErrorMessage(`[sendDeviceStatusMessage] Device ${device.code} status has become ${status}`);
}

export async function sendDeviceMasterProgramUpgradeMessage(device: Pick<Device, 'deviceId' | 'code' | 'status' | 'masterProgramVersion' | 'location'>, receivedVersion: string) {
    logger.info(`[sendDeviceMasterProgramUpgradeMessage] Expect device ${device.code}'s version ${receivedVersion} but is ${device.masterProgramVersion ?? 'unknown'}`);
    sendMessage({
        type: 'device',
        group: device.location.group,
        payload: {
            deviceId: device.deviceId,
            deviceCode: device.code,
            masterProgramVersion: {
                actual: device.masterProgramVersion ?? 'unknown',
                expect: receivedVersion,
            },
        },
    });
    sendDeviceErrorMessage(`[sendDeviceMasterProgramUpgradeMessage] Expect device ${device.code}'s version ${receivedVersion} but is ${device.masterProgramVersion ?? 'unknown'}`);
}
