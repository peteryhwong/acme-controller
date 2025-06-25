import { Task as ProcEvent } from '@ankh/ankh-queue/lib/type';
import { Event } from '../entity/event';
import { components } from './schema';

export const eventTypes = ['heartbeat', 'devicereport', 'healthcheck', 'ping'] as const;
export type EventType = (typeof eventTypes)[number];

export type EventWrapper = ProcEvent & { original: Event };

export interface DeviceReportDetail {
    deviceId: string;
    report: components['schemas']['DeviceReport']['detail'] | components['schemas']['Acknowledgement'];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type EventDetail = DeviceReportDetail | {};
