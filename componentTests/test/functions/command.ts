import { basicAuth } from './basic';
import * as client from './client';
import { LOCAL } from './constant';
import { checkApiWithRetries } from './wait';

// send ping command to device
export async function sendPing(jwtToken: string, deviceId: string) {
    await client.sendCommand({
        baseURL: LOCAL.controller.baseUrl,
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
        path: {
            deviceId,
        },
        body: {
            command: {
                command: 'ping',
            },
        },
    });
}

export async function getDeviceCommands(req: { jwtToken: string; deviceId: string }) {
    const { jwtToken, deviceId } = req;
    const res = await client.getCommands({
        baseURL: LOCAL.controller.baseUrl,
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
        path: {
            deviceId,
        },
    });
    if (!res.data?.command) {
        console.error(res.data);
        throw new Error(`[getCommand]: no command found`);
    }
    return res.data.command;
}

export async function getCommand(deviceCode: string, password = '12345678', group = 'ankh') {
    const res = await client.getCommandsWithKey({
        baseURL: LOCAL.controller.baseUrl,
        headers: {
            Authorization: basicAuth(`${deviceCode}@${group}`, password),
        },
    });
    if (!res.data?.object?.command) {
        console.log(res.data?.object?.command);
        throw new Error(`[getCommand]: no command found`);
    }
    expect(res.data?.code).toEqual(200);
    expect(res.data?.message).toEqual('Commands found');
    return res.data.object.command;
}

export async function acknowledge(deviceCode: string, commandId: string, version?: string) {
    const response = await client.acknowledgeCommandWithKey({
        baseURL: LOCAL.controller.baseUrl,
        headers: {
            Authorization: basicAuth(`${deviceCode}@ankh`, '12345678'),
        },
        body: {
            type: 'acknowledgement',
            detail: {
                version,
                commandId: [commandId],
            },
        },
    });
    console.log(JSON.stringify(response.data, null, 2));
}

export function waitForCommandAcknowledged(req: { deviceId: string; jwtToken: string; commandId: string }) {
    const { deviceId, jwtToken, commandId } = req;
    return checkApiWithRetries(
        () => getDeviceCommands({ jwtToken, deviceId }),
        2,
        30,
        command => command.some(command => command.id === commandId && command.status === 'acknowledged'),
    );
}
