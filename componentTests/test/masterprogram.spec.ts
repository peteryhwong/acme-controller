import { acknowledge, getCommand, waitForCommandAcknowledged } from './functions/command';
import { DEFAULT_LOCATION } from './functions/constant';
import { createDevice, getDevice, upgradeDeviceMasterProgram } from './functions/device';
import { getTokenWithRoles } from './functions/jwt';
import { getLocationId } from './functions/location';
import { getMasterPrograms } from './functions/masterprogram';

describe(`Master Program Upgrade`, () => {
    it('Upgrade', async () => {
        const jwtToken = getTokenWithRoles(['platform_admin']);
        console.log(`Got token ${jwtToken}`);

        const deviceCode = `device${Math.floor(100000 + Math.random() * 900000).toString()}`;
        console.log(`Creating device ${deviceCode}`);
        const deviceId = await createDevice(jwtToken, deviceCode, await getLocationId(jwtToken, DEFAULT_LOCATION));

        console.log(`Getting device ${deviceId}`);
        const offline = await getDevice(jwtToken, deviceId);
        expect(offline.status).toEqual('offline');
        expect(offline.deviceHistory.length).toBe(0);

        console.log(`Getting command`);
        const commands = await getCommand(deviceCode);
        expect(commands).toHaveLength(1);
        console.log(`Got command ${JSON.stringify(commands)}`);

        console.log(`Acknowledge command`);
        await acknowledge(deviceCode, commands[0].id);

        console.log(`Wait for command to be acknowledged`);
        await waitForCommandAcknowledged({ jwtToken, deviceId, commandId: commands[0].id });

        // get master programs
        console.log(`Getting master programs`);
        const masterPrograms = await getMasterPrograms(jwtToken);
        expect(masterPrograms.masterprogram).toHaveLength(2);
        console.log(`Got master programs ${JSON.stringify(masterPrograms.masterprogram)}`);

        // update master program for device
        const version = masterPrograms.masterprogram[0].version;
        console.log(`Upgrading device ${deviceId} to version ${version}`);
        await upgradeDeviceMasterProgram(jwtToken, deviceId, version);

        console.log(`Getting command`);
        const commands2 = await getCommand(deviceCode);
        expect(commands2).toHaveLength(1);
        console.log(`Got command ${JSON.stringify(commands2)}`);

        console.log(`Acknowledge command`);
        await acknowledge(deviceCode, commands2[0].id);

        console.log(`Wait for command to be acknowledged`);
        await waitForCommandAcknowledged({ jwtToken, deviceId, commandId: commands2[0].id });
    }, 300000);
});
