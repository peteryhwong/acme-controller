import { Device } from '../entity/device';
import { TreatmentPlan } from '../entity/treatmentplan';
import { InitialJobStatus, JobStatus, LowercaseJobStatus } from '../types/job';
import { UpdateJob } from '../types/jobhistory';
import { components, operations } from '../types/schema';
import { doesJobRequireApproval } from './approval';
import { isProNewTreatmentPlanValid } from './check';
import { getDateForResponse } from './date';
import { areEqual } from './jobhistory';
import { logger } from './logger';
import { deviceLocalAdminAssigneeUsername, deviceLocalUser, toTreatmentPlanForOfflineJob } from './offline';
import { getAssigneeById, getAssigneeByUsername } from './repository/assignee';
import { createCommand } from './repository/command';
import { getDevice } from './repository/device';
import { createDeviceJob, getJob, getJobs as getJobsInDb, updateJob as updateJobInDb } from './repository/job';
import { getTreatmentPlanMap } from './repository/treatmentplan';
import { getUserById, getUserByUsernumber } from './repository/user';
import { byDatetime } from './sort';
import { loadTreatmentPlans } from './treatmentplan';

export function toStatus(status: JobStatus): LowercaseJobStatus {
    switch (status) {
        case 'Complete':
        case 'complete':
            return 'complete';
        case 'cancelled':
        case 'Cancel':
        case 'cancel':
            return 'cancelled';
        case 'pause':
        case 'Pause':
        case 'Frozen':
        case 'frozen':
            return 'frozen';
        case 'Play':
        case 'play':
            return 'play';
        case 'Abnormal':
        case 'abnormal':
            return 'abnormal';
        case 'Standby':
        case 'standby':
            return 'standby';
        case 'pendingapproval':
            return 'pendingapproval';
    }
}

export function checkPlanAgainstTreatmentPlan(plan: components['schemas']['ProNewTreatmentPlanWithVersion'], treatmentPlan: Pick<TreatmentPlan, 'tens' | 'ultrasound' | 'version'>) {
    return plan.version === treatmentPlan.version.toString() && plan.plan.tens === treatmentPlan.tens && plan.plan.ultrasound === treatmentPlan.ultrasound;
}

export async function getJobStatus(tensSetting: components['schemas']['TensSetting'], userId: string, offlineJobId?: string): Promise<InitialJobStatus> {
    if (offlineJobId) {
        return 'play';
    }
    const requirsApproval = await doesJobRequireApproval(tensSetting, userId);
    if (requirsApproval) {
        return 'pendingapproval';
    }
    return 'pending';
}

export async function createJob(
    deviceId: string,
    req: operations['createJob']['requestBody']['content']['application/json'],
    offlineJobId?: string,
): Promise<operations['createJob']['responses']['201']['content']['application/json'] | components['schemas']['Error']> {
    // check if all plans are valid
    const { plan: unloadedPlan } = req.treatmentPlan.detail;
    logger.info(`[createJob]: check if all plans in preset are valid`);
    const treatmentPlans = await getTreatmentPlanMap({});
    const plan = await loadTreatmentPlans(treatmentPlans, unloadedPlan);
    const preset = plan.preset;
    if (!preset) {
        logger.error(`[createJob]: preset not found`);
        return { error_code: '400', error_message: 'Invalid' };
    }

    // all plans in preset are valid
    let name: keyof typeof preset;
    for (name in preset) {
        if (!treatmentPlans[name]) {
            logger.error(`[createJob]: plan ${name} not found`);
            return { error_code: '400', error_message: 'Invalid' };
        }
        const plan = preset[name];
        if (!isProNewTreatmentPlanValid(name, plan.plan)) {
            logger.error(`[createJob]: plan ${name} is invalid`);
            return { error_code: '400', error_message: 'Invalid' };
        }
    }
    logger.info(`[createJob]: all plans in preset are valid`);

    logger.info(`[createJob]: create job for device ${deviceId}`);
    const device = await getDevice({ deviceId, relation: ['location'] });
    if (!device) {
        logger.error(`[createJob]: device not found`);
        return { error_code: '404', error_message: 'Invalid' };
    }
    const group = device.location.group;
    const { assigneeId, treatmentPlan, userId } = req;
    logger.info(`[createJob]: check if assigneeId ${assigneeId} is valid`);
    const assignee = await getAssigneeById({ assigneeId, groups: [group] });
    if (!assignee) {
        logger.error(`[createJob]: assignee not found`);
        return { error_code: '404', error_message: 'Invalid' };
    }
    const user = await getUserById({ userId, groups: [group] });
    if (!user) {
        logger.error(`[createJob]: user not found`);
        return { error_code: '404', error_message: 'Invalid' };
    }
    const jobStatus = await getJobStatus(req.treatmentPlan.detail.tensSetting, userId, offlineJobId);
    const job = await createDeviceJob({
        device,
        assignee,
        user,
        detail: {
            treatmentPlan,
        },
        offlineJobId,
        status: jobStatus,
    });
    const { jobId, status } = job;
    logger.info(`[createJob]: created job ${jobId} with status ${status}`);
    if (!job.offlineJobId && job.status !== 'pendingapproval') {
        const command = await createCommand(
            device,
            {
                action: 'create',
                jobId,
                treatmentPlan,
                assignee: {
                    username: assignee.username,
                    hash: assignee.hash,
                },
            },
            job,
        );
        logger.info(`[createDevice] created command ${command.commandId}`);
    }
    return {
        assigneeId,
        userId,
        treatmentPlan,
        jobId,
        status,
        deviceId,
    };
}

export async function createOfflineJob(device: Pick<Device, 'deviceId' | 'code' | 'location'>, offlineJobId: string, report: components['schemas']['JobHistory']): Promise<string> {
    const assigneeUsername = deviceLocalAdminAssigneeUsername(device.deviceId);
    logger.info(`[createOfflineJob]: check if assignee ${assigneeUsername} is valid`);
    const group = device.location.group;
    const assignee = await getAssigneeByUsername({ username: assigneeUsername, groups: [group] });
    if (!assignee) {
        logger.error(`[createOfflineJob]: assignee not found`);
        throw new Error('Assignee not found');
    }
    const userNumber = deviceLocalUser(device.deviceId);
    logger.info(`[createOfflineJob]: check if user ${userNumber} is valid`);
    const user = await getUserByUsernumber({ userNumber, groups: [group] });
    if (!user) {
        logger.error(`[createOfflineJob]: user not found`);
        throw new Error('[createOfflineJob]: user not found');
    }
    const treatmentPlan = toTreatmentPlanForOfflineJob(report);
    logger.info(`[createOfflineJob]: treatment plan ${JSON.stringify(treatmentPlan)}`);
    logger.info(`[createOfflineJob]: create job for device ${device.deviceId}`);
    const result = await createJob(
        device.deviceId,
        {
            assigneeId: assignee.assigneeId,
            treatmentPlan,
            userId: user.userId,
        },
        offlineJobId,
    );
    if (!('jobId' in result && result.jobId)) {
        logger.error(`[createOfflineJob]: job not created`);
        throw new Error('[createOfflineJob]: job not created');
    }
    logger.info(`[createOfflineJob]: created job ${result.jobId}`);
    return result.jobId;
}

export async function updateJob(
    jobId: string,
    author: string,
    req: UpdateJob,
    groups?: string[],
): Promise<operations['updateJob']['responses']['200']['content']['application/json'] | components['schemas']['Error']> {
    logger.info(`[updateJob]: update job ${jobId}`);
    const job = await getJob({ groups, jobId, relation: ['device', 'assignee'] });
    if (!job) {
        logger.error(`[updateJob]: job not found`);
        return { error_code: '404', error_message: 'Invalid' };
    }

    if (job.status === 'cancelled') {
        logger.error(`[updateJob]: job is canceled`);
        return { error_code: '400', error_message: 'Job is canceled' };
    }

    if (job.status === 'complete') {
        logger.error(`[updateJob]: job has completed`);
        return { error_code: '400', error_message: 'Job has completed' };
    }

    const existing: UpdateJob = {
        assigneeId: job.assigneeId,
        treatmentPlan: job.detail.treatmentPlan,
        deviceId: job.deviceId,
        userId: job.userId,
    };

    if (areEqual(existing, req)) {
        logger.info(`[updateJob]: no change to job ${jobId}`);
        return {
            assigneeId: job.assigneeId,
            userId: job.userId,
            treatmentPlan: job.detail.treatmentPlan,
            jobId,
            status: job.status,
            deviceId: job.deviceId,
        };
    }

    // check if assigneeId is valid
    const { assigneeId, userId, deviceId } = req;
    const assignee = await getAssigneeById({ assigneeId, groups });
    if (!assignee) {
        logger.error(`[updateJob]: assignee not found`);
        return { error_code: '404', error_message: 'Invalid' };
    }

    const user = await getUserById({ userId, groups });
    if (!user) {
        logger.error(`[updateJob]: user not found`);
        return { error_code: '404', error_message: 'Invalid' };
    }

    const device = await getDevice({ deviceId, groups });
    if (!device) {
        logger.error(`[updateJob]: device not found`);
        return { error_code: '404', error_message: 'Invalid' };
    }

    // update job
    logger.info(`[updateJob]: update job ${jobId}`);
    const updated = await updateJobInDb({
        jobId,
        author,
        type: 'platform',
        update: {
            assignee,
            device,
            detail: {
                treatmentPlan: req.treatmentPlan,
            },
        },
    });

    // send command
    logger.info(`[updateJob]: send command to device ${device.deviceId}`);
    const command = await createCommand(
        device,
        {
            action: 'update',
            jobId,
            treatmentPlan: req.treatmentPlan,
            assignee: {
                username: assignee.username,
                hash: assignee.hash,
            },
        },
        updated,
    );
    logger.info(`[updateJob]: command ${command.commandId} created`);
    return {
        assigneeId: assignee.assigneeId,
        userId: user.userId,
        deviceId: device.deviceId,
        treatmentPlan: req.treatmentPlan,
        jobId,
        status: updated.status,
    };
}

export function getUpdateAction(status: operations['updateJobStatus']['requestBody']['content']['application/json']['status']): components['schemas']['JobAction']['action'] {
    switch (status) {
        case 'play':
            return 'play';
        case 'frozen':
            return 'freeze';
        case 'cancelled':
            return 'cancel';
    }
}

export async function updateJobStatus(updateReq: {
    jobId: string;
    author: string;
    req: operations['updateJobStatus']['requestBody']['content']['application/json'];
    forceCommand?: boolean;
    groups?: string[];
}): Promise<operations['updateJobStatus']['responses']['200']['content']['application/json'] | components['schemas']['Error']> {
    const { groups, jobId, author, req, forceCommand } = updateReq;
    logger.info(`[updateJobStatus]: update job ${jobId}`);
    const job = await getJob({ groups, jobId, relation: ['device'] });
    if (!job) {
        logger.error(`[updateJobStatus]: job not found`);
        return { error_code: '404', error_message: 'Invalid' };
    }
    if (!job.device) {
        logger.error(`[updateJobStatus]: device not found`);
        return { error_code: '404', error_message: 'Invalid' };
    }
    if (job.status === 'pendingapproval') {
        logger.error(`[updateJobStatus]: job is pending approval`);
        return { error_code: '400', error_message: 'Job is pending approval' };
    }
    // check if status is already req.status
    if (job.status === req.status) {
        logger.info(`[updateJobStatus]: job status is already ${req.status}`);
        if (forceCommand === true) {
            logger.info(`[updateJobStatus]: force command`);
        } else {
            return {
                status: req.status,
            };
        }
    }

    // check if status is cancelled
    if (job.status === 'cancelled') {
        logger.error(`[updateJobStatus]: job is canceled`);
        if (forceCommand === true) {
            logger.info(`[updateJobStatus]: force command`);
        } else {
            return { error_code: '400', error_message: 'Job is canceled' };
        }
    }

    // update job
    let updated = job;
    if (job.status !== req.status) {
        logger.info(`[updateJob]: update job ${jobId} to status ${req.status}`);
        updated = await updateJobInDb({
            jobId,
            author,
            type: 'platform',
            update: {
                status: req.status,
            },
        });
    }

    // send command
    const action = getUpdateAction(req.status);
    logger.info(`[updateJob]: send ${action} command to device ${job.deviceId}`);
    const command = await createCommand(
        job.device,
        {
            action,
            jobId,
        },
        updated,
    );
    logger.info(`[updateJob]: command ${command.commandId} created`);
    return {
        status: req.status,
    };
}

export async function getJobsInAscendingOrder(req: { groups?: string[]; jobId?: string[]; status?: string[] }): Promise<components['schemas']['BaseJobWithJobIdAndStatusAndAssigneeAndDeviceId'][]> {
    const { jobId, status, groups } = req;
    logger.info(`[getJobs]: get jobs with jobId ${jobId?.join()} and status ${status?.join()}`);
    const jobs = await getJobsInDb({ groups, relation: ['device', 'assignee', 'user'], jobId, status });
    logger.info(`[getJobs]: found ${jobs.length} jobs`);
    return jobs.sort(byDatetime).map(({ datetime, assigneeId, userId, jobId, detail, status, deviceId, offlineJobId }) => ({
        ...detail,
        datetime: getDateForResponse(datetime),
        jobId,
        status,
        deviceId,
        assigneeId,
        userId,
        offlineJobId: offlineJobId ?? undefined,
    }));
}

export async function approveJob(
    jobId: string,
    author: string,
    approval: boolean,
): Promise<operations['createJob']['responses']['201']['content']['application/json'] | components['schemas']['Error']> {
    logger.info(`[approveJob]: approve job ${jobId}`);
    const job = await getJob({ jobId, relation: ['device', 'assignee', 'user'] });
    if (!job) {
        logger.error(`[approveJob]: job not found`);
        return { error_code: '404', error_message: 'Invalid' };
    }
    if (!job.device) {
        logger.error(`[approveJob]: device not found`);
        return { error_code: '404', error_message: 'Invalid' };
    }
    if (!job.assignee) {
        logger.error(`[approveJob]: assignee not found`);
        return { error_code: '404', error_message: 'Invalid' };
    }
    if (job.status !== 'pendingapproval') {
        logger.error(`[approveJob]: job is not pending approval`);
        return { error_code: '400', error_message: 'Job is not pending approval' };
    }
    const status = approval ? 'pending' : 'cancelled';
    logger.info(`[approveJob]: update job ${jobId} to status ${status}`);
    const updated = await updateJobInDb({
        jobId,
        author,
        type: 'platform',
        update: {
            status,
        },
    });
    if (approval) {
        logger.info(`[approveJob]: job ${jobId} approved`);
        logger.info(`[approveJob]: send create command to device ${job.deviceId}`);
        const command = await createCommand(
            job.device,
            {
                action: 'create',
                jobId,
                treatmentPlan: job.detail.treatmentPlan,
                assignee: {
                    username: job.assignee.username,
                    hash: job.assignee.hash,
                },
            },
            job,
        );
        logger.info(`[approveJob]: command ${command.commandId} created`);
    } else {
        logger.info(`[approveJob]: job ${jobId} rejected`);
    }
    return {
        assigneeId: job.assigneeId,
        userId: job.userId,
        treatmentPlan: job.detail.treatmentPlan,
        jobId,
        status: updated.status,
        deviceId: job.deviceId,
    };
}
