import * as client from './client';
import { LOCAL } from './constant';

export async function createDevice(jwtToken: string, code: string, locationId: string, status: 'online' | 'offline' = 'offline') {
    const res = await client.createDevice({
        baseURL: LOCAL.controller.baseUrl,
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
        body: {
            code,
            password: '12345678',
            type: 'acme001',
            locationId,
        },
    });
    if (!res.data?.deviceId) {
        expect(res.data?.deviceId).toBeDefined();
        throw new Error('deviceId is not defined');
    }
    const devices = await client.listDevices({
        baseURL: LOCAL.controller.baseUrl,
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
    });
    expect(devices.data?.devices).toContainEqual({
        deviceId: res.data.deviceId,
        code,
        type: 'acme001',
        status,
        locationId,
        masterProgramVersion: 'unknown',
        deviceHistory: [],
    });
    return res.data.deviceId;
}

export async function getDevices(jwtToken: string) {
    const res = await client.listDevices({
        baseURL: LOCAL.controller.baseUrl,
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
    });
    if (!res.data) {
        expect(res.data).toBeDefined();
        throw new Error('res.data is not defined');
    }
    return res.data;
}

// get a device
export async function getDevice(jwtToken: string, deviceId: string) {
    const res = await client.getDeviceById({
        baseURL: LOCAL.controller.baseUrl,
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
        path: {
            deviceId,
        },
    });
    expect(res.status).toEqual(200);
    expect(res.data?.deviceId).toEqual(deviceId);
    if (!res.data) {
        expect(res.data).toBeDefined();
        throw new Error('res.data is not defined');
    }
    return res.data;
}

export async function changePassword(jwtToken: string, deviceId: string, newPassword: string) {
    const res = await client.updateDevicePassword({
        baseURL: LOCAL.controller.baseUrl,
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
        path: {
            deviceId,
        },
        body: {
            password: newPassword,
        },
    });
    expect(res.status).toEqual(200);
    if (!res.data) {
        expect(res.data).toBeDefined();
        throw new Error('res.data is not defined');
    }
    return res.data;
}

// delete device
export async function deleteDevice(jwtToken: string, deviceId: string) {
    const res = await client.deleteDevice({
        baseURL: LOCAL.controller.baseUrl,
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
        path: {
            deviceId,
        },
    });
    expect(res.status).toEqual(200);
    // check if device is deleted
    const devices = await client.listDevices({
        baseURL: LOCAL.controller.baseUrl,
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
    });
    expect(devices.data?.devices.map(device => device.deviceId)).not.toContainEqual(deviceId);
}

export async function getDeviceEvents(jwtToken: string, deviceId: string) {
    const result = await client.listDeviceEvents({
        baseURL: LOCAL.controller.baseUrl,
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
        path: {
            deviceId,
        },
    });
    if (!result.data) {
        throw new Error('result.data is not defined');
    }
    return result.data.event;
}

export async function upgradeDeviceMasterProgram(jwtToken: string, deviceId: string, version: string) {
    const result = await client.updateDeviceMasterProgram({
        baseURL: LOCAL.controller.baseUrl,
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
        path: {
            deviceId,
        },
        body: {
            version,
        },
    });
    expect(result.status).toEqual(200);
    if (!result.data) {
        throw new Error('result.data is not defined');
    }
    return result.data;
}

// update device location
export async function updateDeviceLocation(jwtToken: string, deviceId: string, locationId: string) {
    const result = await client.updateDeviceLocation({
        baseURL: LOCAL.controller.baseUrl,
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
        path: {
            deviceId,
        },
        body: {
            locationId,
        },
    });
    expect(result.status).toEqual(200);
    if (!result.data) {
        throw new Error('result.data is not defined');
    }
    return result.data;
}
