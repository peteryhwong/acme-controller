import { Request } from 'express';
import { Device } from '../entity/device';
import { logger } from './logger';

// get Device id and code from request body
export function getDeviceIdAndCodeFromRequest(request: Request) {
    const device = (request as any).device as { device: Pick<Device, 'code' | 'deviceId'>; group: string } | undefined;
    if (!device) {
        logger.error(`[request.getDeviceIdAndCode] device not found`);
        throw new Error('Device not found');
    }
    return device;
}

// add device id and code to request body
export function addDeviceIdAndCodeToRequest(request: Request, device: Pick<Device, 'code' | 'deviceId'>, group: string) {
    (request as any).device = { device, group };
    return request;
}
