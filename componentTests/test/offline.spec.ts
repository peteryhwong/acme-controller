import { acknowledge, getCommand, waitForCommandAcknowledged } from './functions/command';
import { DEFAULT_LOCATION } from './functions/constant';
import { createDevice, getDevice } from './functions/device';
import { getJobs } from './functions/job';
import { getTokenWithRoles } from './functions/jwt';
import { getLocationId } from './functions/location';
import { createDeviceReport } from './functions/report';
import { checkApiWithRetries } from './functions/wait';

describe('device', () => {
    it('add a device, bring it online, and have it send an offline job report', async () => {
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
        const commands = await getCommand(deviceCode);
        expect(commands).toHaveLength(1);
        console.log(`Got command ${JSON.stringify(commands)}`);

        console.log(`Acknowledge command`);
        await acknowledge(deviceCode, commands[0].id, '1.1.2');

        console.log(`Wait for command to be acknowledged`);
        await waitForCommandAcknowledged({ jwtToken, deviceId, commandId: commands[0].id });

        console.log(`Create offlien job report`);
        const offlineJobId = new Date().getTime().toString();
        await createDeviceReport(deviceCode, {
            detail: {
                assigneeUsername: '',
                status: 'Play',
            },
            jobId: '',
            type: 'interim',
            offlineJobId,
        });

        console.log(`Wait for job report to be processed`);
        await checkApiWithRetries(
            () => getJobs(jwtToken),
            2,
            10,
            jobs => jobs.some(job => job.offlineJobId === offlineJobId && job.status === 'play'),
        );
        console.log(`Job report is processed`);

        console.log(`Create completion job report`);
        await createDeviceReport(deviceCode, {
            detail: {
                assigneeUsername: '',
                status: 'Complete',
            },
            jobId: '',
            type: 'completion',
            offlineJobId,
        });

        console.log(`Wait for job report to be processed`);
        await checkApiWithRetries(
            () => getJobs(jwtToken),
            2,
            10,
            jobs => jobs.some(job => job.offlineJobId === offlineJobId && job.status === 'complete'),
        );
        console.log(`Job report is processed`);
    }, 60000);
});
