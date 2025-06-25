import { Device } from '../entity/device';
import { Job } from '../entity/job';
import { JobDifference } from './job';

export interface DeviceMasterProgramUpgradePayload {
    deviceId: string;
    deviceCode: string;
    masterProgramVersion: {
        expect: string;
        actual: string;
    };
}

export interface DeviceResponsivenessPayload {
    deviceId: string;
    deviceCode: string;
    status: Device['status'];
}

export interface JobStatusPayload {
    deviceId: string;
    deviceCode: string;
    jobId: string;
    status: Job['status'];
    detail: JobDifference[];
}

export interface JobAnomalyPayload {
    deviceId: string;
    deviceCode: string;
    jobId?: string;
    detail: string;
}

export interface WebSocketMessage {
    type: 'device' | 'job';
    group: string;
    payload: DeviceMasterProgramUpgradePayload | DeviceResponsivenessPayload | JobStatusPayload | JobAnomalyPayload;
}
