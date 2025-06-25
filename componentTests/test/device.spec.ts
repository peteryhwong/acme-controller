import { acknowledge, getCommand, sendPing, waitForCommandAcknowledged } from './functions/command';
import { getLocationId } from './functions/location';
import { changePassword, createDevice, deleteDevice, getDevice, getDeviceEvents } from './functions/device';
import { getTokenWithRoles } from './functions/jwt';
import { DEFAULT_LOCATION } from './functions/constant';

describe('device', () => {
    it('add a device, bring it online, delete it (make it offline) and make it online again', async () => {
        const jwtToken = getTokenWithRoles(['platform_admin']);
        console.log(`Got token ${jwtToken}`);

        const deviceCode = `device${Math.floor(100000 + Math.random() * 900000).toString()}`;
        console.log(`Creating device ${deviceCode}`);
        const deviceId = await createDevice(jwtToken, deviceCode, await getLocationId(jwtToken, DEFAULT_LOCATION));

        console.log(`Getting device ${deviceId}`);
        const offline = await getDevice(jwtToken, deviceId);
        expect(offline.status).toEqual('offline');
        expect(offline.deviceHistory.length).toBe(0);
        expect(offline.masterProgramVersion).toBe('unknown');

        console.log(`Getting command`);
        const commands = await getCommand(deviceCode, '12345678', 'ankh');
        expect(commands).toHaveLength(1);
        console.log(`Got command ${JSON.stringify(commands)}`);

        console.log(`Acknowledge command`);
        await acknowledge(deviceCode, commands[0].id, '1.1.2');

        console.log(`Wait for command to be acknowledged`);
        await waitForCommandAcknowledged({ jwtToken, deviceId, commandId: commands[0].id });

        console.log(`Getting device ${deviceId}`);
        const online = await getDevice(jwtToken, deviceId);
        expect(online.status).toBe('online');
        expect(online.deviceHistory.length).toBe(2);
        expect(online.masterProgramVersion).toBe('1.1.2');

        console.log(`Delete device ${deviceId}`);
        await deleteDevice(jwtToken, deviceId);

        console.log(`Getting device ${deviceId}`);
        const deleted = await getDevice(jwtToken, deviceId);
        expect(deleted.status).toBe('offline');
        expect(deleted.deviceHistory.length).toBe(3);

        // re-initiate device
        await sendPing(jwtToken, deviceId);

        console.log(`Getting command`);
        const commands2 = await getCommand(deviceCode);
        expect(commands2).toHaveLength(1);
        console.log(`Got command ${JSON.stringify(commands2)}`);

        console.log(`Acknowledge command`);
        await acknowledge(deviceCode, commands2[0].id, '1.2.3');

        console.log(`Wait for command to be acknowledged`);
        await waitForCommandAcknowledged({ jwtToken, deviceId, commandId: commands2[0].id });

        console.log(`Getting device ${deviceId}`);
        const online2 = await getDevice(jwtToken, deviceId);
        expect(online2.status).toBe('online');
        expect(online2.deviceHistory.length).toBe(5);
        expect(online2.masterProgramVersion).toBe('1.2.3');

        console.log(`Get events of device ${deviceId}`);
        const events = await getDeviceEvents(jwtToken, deviceId);
        console.log(`Got events ${JSON.stringify(events)}`);
        expect(events.length).toBeGreaterThan(0);

        console.log(`Change password of device ${deviceId}`);
        await changePassword(jwtToken, deviceId, '123456789');

        console.log(`Getting command`);
        const updatedCommands = await getCommand(deviceCode, '123456789', 'ankh');
        expect(updatedCommands).toHaveLength(0);
    }, 60000);
});
