import { approveJob, getJobRequiresApproval } from './functions/approval';
import { createAssignee } from './functions/assignee';
import * as client from './functions/client';
import { acknowledge, getCommand, waitForCommandAcknowledged } from './functions/command';
import { DEFAULT_LOCATION } from './functions/constant';
import { createDevice } from './functions/device';
import { createDeviceJob, getJob, getJobs, updateJob, updateJobStatus } from './functions/job';
import { getTokenWithRoles } from './functions/jwt';
import { createLocation, getLocationId } from './functions/location';
import { createDeviceReport } from './functions/report';
import { DEFAULT_TREATMENT_PLAN } from './functions/treatment';
import { createUser } from './functions/user';
import { checkApiWithRetries } from './functions/wait';

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

describe(`Add a job`, () => {
    it('Add a job', async () => {
        const jwtToken = getTokenWithRoles(['platform_admin']);
        console.log(`Got token ${jwtToken}`);

        console.log(`Creating location tst`);
        const location = await createLocation(jwtToken, 'tst');
        console.log(`Created location ${location}`);

        console.log(`Creating device device001`);
        const deviceId = await createDevice(jwtToken, 'device001', location, 'offline');
        console.log(`Created device ${deviceId}`);

        console.log(`Creating assignee peterwong`);
        const assigneeId = await createAssignee(jwtToken, 'peterwong', location);
        console.log(`Created assignee ${assigneeId}`);

        console.log(`Creating user john`);
        const userId = await createUser(jwtToken, 'John', 'ANKH-123', location);
        console.log(`Created user ${userId}`);

        console.log(`Getting command`);
        const commands = await getCommand('device001');
        expect(commands).toHaveLength(1);
        console.log(`Got command ${JSON.stringify(commands)}`);

        console.log(`Acknowledge command`);
        await acknowledge('device001', commands[0].id);

        console.log(`Wait for command to be acknowledged`);
        await waitForCommandAcknowledged({ jwtToken, deviceId, commandId: commands[0].id });

        console.log(`Create job that requires approval`);
        const jobId = await createDeviceJob(jwtToken, {
            deviceId,
            assigneeId,
            userId,
            treatmentPlan: {
                ...DEFAULT_TREATMENT_PLAN,
                detail: {
                    ...DEFAULT_TREATMENT_PLAN.detail,
                    tensSetting: {
                        ...DEFAULT_TREATMENT_PLAN.detail.tensSetting,
                        intensitylimit: {
                            ...DEFAULT_TREATMENT_PLAN.detail.tensSetting.intensitylimit,
                            ch4: 40,
                        },
                    },
                },
            },
        });
        console.log(`Created job ${jobId}`);

        console.log(`Get job`);
        const job = await getJob(jwtToken, jobId);
        console.log(`Got job ${JSON.stringify(job)}`);
        expect(job.jobHistory).toHaveLength(0);

        // get all jobs and check if the job is in the list
        console.log(`Get all jobs`);
        const jobs = await getJobs(jwtToken);
        const storedJob = jobs.find(job => job.jobId === jobId);
        expect(storedJob).toBeDefined();
        expect(storedJob?.assigneeId).toBe(assigneeId);
        expect(storedJob?.userId).toBe(userId);
        expect(storedJob?.deviceId).toBe(deviceId);
        expect(storedJob?.status).toBe('pendingapproval');

        // get approval jobs and approve it
        console.log(`Get approval jobs`);
        const approvalJobs = await getJobRequiresApproval(jwtToken);
        const approvalJob = approvalJobs.find(job => job.jobId === jobId);
        expect(approvalJob).toBeDefined();
        console.log(`Got approval jobs ${JSON.stringify(approvalJobs)}`);

        console.log(`Approve job`);
        await approveJob(jwtToken, jobId, true);
        console.log(`Approved job`);
        const approvedJob = await getJob(jwtToken, jobId);
        expect(approvedJob.status).toBe('pending');

        console.log(`Getting command`);
        const jobcommands = await getCommand('device001');
        expect(jobcommands).toHaveLength(1);
        console.log(`Got command ${JSON.stringify(jobcommands)}`);

        console.log(`Acknowledge command`);
        await acknowledge('device001', jobcommands[0].id);

        console.log(`Wait for aknowledged command`);
        await waitForCommandAcknowledged({ jwtToken, deviceId, commandId: jobcommands[0].id });

        console.log(`Create report`);
        const report = await createDeviceReport('device001', {
            detail: {
                assigneeUsername: 'peterwong',
                status: 'play',
            },
            jobId,
            type: 'interim',
        });
        console.log(`Created report ${report}`);

        console.log(`Wait for job report to be processed`);
        await checkApiWithRetries(
            () => getJob(jwtToken, jobId),
            2,
            10,
            job => job.status === 'play',
        );
        console.log(`Job report is processed`);

        // get current job
        console.log(`Check job`);
        const updatedJob: PartialBy<client.BaseJobWithJobIdAndStatusAndAssigneeAndDeviceIdAndHistory, 'jobHistory'> = await getJob(jwtToken, jobId);
        expect(updatedJob.treatmentPlan.detail.ultrasoundSetting.intensityLimit.oneMC).toBe(DEFAULT_TREATMENT_PLAN.detail.ultrasoundSetting.intensityLimit.oneMC);
        console.log(`Got job ${JSON.stringify(updatedJob)}`);

        // update job
        console.log(`Update job's ultrasoundSetting.intensityLimit.oneMC`);
        delete updatedJob.jobHistory;
        const loweredOneMC = await updateJob(jwtToken, jobId, {
            ...updatedJob,
            treatmentPlan: {
                ...updatedJob.treatmentPlan,
                detail: {
                    ...updatedJob.treatmentPlan.detail,
                    ultrasoundSetting: {
                        ...updatedJob.treatmentPlan.detail.ultrasoundSetting,
                        intensityLimit: {
                            ...updatedJob.treatmentPlan.detail.ultrasoundSetting.intensityLimit,
                            oneMC: 5,
                        },
                    },
                },
            },
        });
        console.log(`Got job ${JSON.stringify(loweredOneMC)}`);

        console.log(`Getting command`);
        const updateCommands = await getCommand('device001');
        expect(updateCommands).toHaveLength(1);
        console.log(`Got command ${JSON.stringify(updateCommands)}`);

        console.log(`Acknowledge command`);
        await acknowledge('device001', updateCommands[0].id);

        console.log(`Wait for aknowledged command`);
        await waitForCommandAcknowledged({ jwtToken, deviceId, commandId: updateCommands[0].id });

        const checkJob = await getJob(jwtToken, jobId);
        expect(checkJob.treatmentPlan.detail.ultrasoundSetting.intensityLimit.oneMC).toBe(5);
        const history = checkJob.jobHistory[0].detail;
        if (!('treatmentPlan' in history)) {
            console.error(`History ${JSON.stringify(checkJob.jobHistory)}`);
            throw new Error('History does not have treatmentPlan');
        }
        expect(history.treatmentPlan.detail.ultrasoundSetting.intensityLimit.oneMC).toBe(DEFAULT_TREATMENT_PLAN.detail.ultrasoundSetting.intensityLimit.oneMC);

        // pause job
        const updatedStatus = await updateJobStatus(jwtToken, jobId, 'frozen');
        console.log(`Got job ${JSON.stringify(updatedStatus)}`);
        expect(updatedStatus.status).toBe('frozen');

        console.log(`Getting command`);
        const updateStatusCommands = await getCommand('device001');
        expect(updateStatusCommands).toHaveLength(1);
        console.log(`Got command ${JSON.stringify(updateStatusCommands)}`);

        console.log(`Acknowledge command`);
        await acknowledge('device001', updateStatusCommands[0].id);

        console.log(`Wait for aknowledged command`);
        await waitForCommandAcknowledged({ jwtToken, deviceId, commandId: updateStatusCommands[0].id });

        // job still has status frozen so this command will be ignored
        const notForcedUpdatedStatus = await updateJobStatus(jwtToken, jobId, 'frozen');
        console.log(`Got status ${JSON.stringify(notForcedUpdatedStatus)}`);
        expect(notForcedUpdatedStatus.status).toBe('frozen');

        console.log(`Getting command`);
        const notForcedUpdateStatusCommands = await getCommand('device001');
        expect(notForcedUpdateStatusCommands).toHaveLength(0);
        console.log(`Got command ${JSON.stringify(notForcedUpdateStatusCommands)}`);

        // force command to be sent through
        const forcedUpdatedStatus = await updateJobStatus(jwtToken, jobId, 'frozen', true);
        console.log(`Got status ${JSON.stringify(forcedUpdatedStatus)}`);
        expect(forcedUpdatedStatus.status).toBe('frozen');

        console.log(`Getting command`);
        const forcedUpdateStatusCommands = await getCommand('device001');
        expect(forcedUpdateStatusCommands).toHaveLength(1);
        console.log(`Got command ${JSON.stringify(forcedUpdateStatusCommands)}`);

        console.log(`Acknowledge command`);
        await acknowledge('device001', forcedUpdateStatusCommands[0].id);

        console.log(`Wait for aknowledged command`);
        await waitForCommandAcknowledged({ jwtToken, deviceId, commandId: forcedUpdateStatusCommands[0].id });

        console.log(`Create report`);
        await createDeviceReport('device001', {
            detail: {
                assigneeUsername: 'peterwong',
                status: 'Pause',
            },
            jobId,
            type: 'interim',
        });
        console.log(`Created report ${report}`);

        console.log(`Wait for job report to be processed`);
        await checkApiWithRetries(
            () => getJob(jwtToken, jobId),
            2,
            10,
            job => job.status === 'frozen',
        );
        console.log(`Job report is processed`);

        console.log(`Create report`);
        await createDeviceReport('device001', {
            detail: {
                assigneeUsername: 'peterwong',
                status: 'Play',
            },
            jobId,
            type: 'interim',
        });
        console.log(`Created report ${report}`);

        console.log(`Wait for job report to be processed`);
        await checkApiWithRetries(
            () => getJob(jwtToken, jobId),
            2,
            10,
            job => job.status === 'play',
        );
        console.log(`Job report is processed`);

        console.log(`Create report`);
        await createDeviceReport('device001', {
            detail: {
                assigneeUsername: 'peterwong',
                status: 'Complete',
            },
            jobId,
            type: 'interim',
        });
        console.log(`Created report ${report}`);

        console.log(`Wait for job report to be processed`);
        await checkApiWithRetries(
            () => getJob(jwtToken, jobId),
            2,
            10,
            job => job.status === 'complete',
        );
        console.log(`Job report is processed`);
    }, 60000);

    it('Reject a job', async () => {
        const jwtToken = getTokenWithRoles(['platform_admin']);
        console.log(`Got token ${jwtToken}`);

        const locationId = await getLocationId(jwtToken, DEFAULT_LOCATION);
        const deviceCode = `device${Math.floor(100000 + Math.random() * 900000).toString()}`;
        console.log(`Creating device ${deviceCode}`);
        const deviceId = await createDevice(jwtToken, deviceCode, locationId);

        const assigneeUsername = Math.random().toString(36).substring(2, 8);
        console.log(`Creating assignee peterwong`);
        const assigneeId = await createAssignee(jwtToken, assigneeUsername, locationId);
        console.log(`Created assignee ${assigneeId}`);

        const userNumberSuffix = Math.random().toString(36).substring(2, 8);
        console.log(`Creating user john`);
        const userId = await createUser(jwtToken, 'John', `ANKH-${userNumberSuffix}`, locationId);
        console.log(`Created user ${userId}`);

        console.log(`Getting command`);
        const commands = await getCommand(deviceCode);
        expect(commands).toHaveLength(1);
        console.log(`Got command ${JSON.stringify(commands)}`);

        console.log(`Acknowledge command`);
        await acknowledge(deviceCode, commands[0].id);

        console.log(`Wait for command to be acknowledged`);
        await waitForCommandAcknowledged({ jwtToken, deviceId, commandId: commands[0].id });

        console.log(`Create job that requires approval`);
        const jobId = await createDeviceJob(jwtToken, {
            deviceId,
            assigneeId,
            userId,
            treatmentPlan: {
                ...DEFAULT_TREATMENT_PLAN,
                detail: {
                    ...DEFAULT_TREATMENT_PLAN.detail,
                    tensSetting: {
                        ...DEFAULT_TREATMENT_PLAN.detail.tensSetting,
                        channel: {
                            ch1: true,
                            ch2: true,
                            ch3: true,
                            ch4: true,
                        },
                    },
                },
            },
        });
        console.log(`Created job ${jobId}`);

        console.log(`Get job`);
        const job = await getJob(jwtToken, jobId);
        console.log(`Got job ${JSON.stringify(job)}`);
        expect(job.status).toBe('pendingapproval');

        // reject job
        console.log(`Reject job`);
        await approveJob(jwtToken, jobId, false);
        console.log(`Rejected job`);

        console.log(`Get job`);
        const rejectedJob = await getJob(jwtToken, jobId);
        console.log(`Got job ${JSON.stringify(job)}`);
        expect(rejectedJob.status).toBe('cancelled');
    }, 60000);
});
