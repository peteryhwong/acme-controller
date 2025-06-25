import { Status } from '@ankh/ankh-queue/lib/type';
import { Device } from '../entity/device';
import { Job } from '../entity/job';
import { DeviceReportDetail } from '../types/event';
import { components } from '../types/schema';
import { isUltrasoundOverheatAnormaly, isUltrasoundTemperatureAnormaly } from './anormaly';
import { checkJob } from './check';
import { processAcknowledgement } from './command';
import { DISABLE_JOB_CHECK } from './constant';
import { sendDeviceErrorMessage } from './integration/slack';
import { createOfflineJob, toStatus } from './job';
import { logger } from './logger';
import { sendJobAnonmalyMessage, sendJobDifferenceMessage } from './message';
import { globalOfflineJobId } from './offline';
import { getDevice } from './repository/device';
import { addErrorJobHistory, addJobHistory, getJob, updateJob } from './repository/job';

export async function processErrorReport(deviceId: string, report: components['schemas']['ErrorHistory']): Promise<Status> {
    const { jobId, type, detail } = report;
    const { error, startedAt, endedAt } = detail;
    const job = await getJob({ jobId, relation: ['device', 'location'] });
    if (!job) {
        logger.error(`[processErrorReport]: job not found`);
        throw new Error('Job not found');
    }
    if (job.device?.deviceId !== deviceId) {
        logger.error(`[processErrorReport]: device id mismatch`);
        throw new Error('Device id mismatch');
    }
    const hasUltrasoundOverheatAnormalyResult = await isUltrasoundOverheatAnormaly(job, report);
    if (hasUltrasoundOverheatAnormalyResult) {
        logger.error(`[processErrorReport]: job ${jobId} has ultrasound overheat anormaly`);
        await sendJobAnonmalyMessage(job.device, 'ultrasound overheat anormaly', job.jobId);
    }
    logger.info(`[processErrorReport]: process error report ${deviceId}...`);
    sendDeviceErrorMessage(`[processErrorReport]: device ${deviceId} has error: ${error} of ${type} at ${startedAt} to ${endedAt}`);
    logger.info(`[processErrorReport]: add error job history for ${jobId}`);
    await addErrorJobHistory({
        jobId,
        author: deviceId,
        type: 'error',
        error: {
            error,
            endedAt,
            startedAt,
        },
    });
    return 'processed';
}

export async function getOrCreateJob(req: { device: Device; jobId?: string; offlineJobId?: string; relation?: (keyof Job)[]; report: components['schemas']['JobHistory'] }) {
    const { device, jobId, offlineJobId: rawOfflineJobId, relation, report } = req;
    if (jobId && jobId.length > 0) {
        logger.info(`[getOrCreateJob] get job ${jobId}...`);
        return await getJob({ jobId, relation });
    } else if (rawOfflineJobId && rawOfflineJobId.length > 0) {
        const offlineJobId = globalOfflineJobId(device.deviceId, rawOfflineJobId);
        logger.info(`[getOrCreateJob] get offline job ${offlineJobId}...`);
        const offlineJob = await getJob({ offlineJobId, relation });
        if (offlineJob) {
            return offlineJob;
        }
        logger.info(`[getOrCreateJob] create offline job ${offlineJobId}...`);
        const jobId = await createOfflineJob(device, offlineJobId, report);
        return await getJob({ jobId, relation });
    } else {
        throw new Error('Job id and offline job id cannot be empty');
    }
}

export async function processJobReport(deviceId: string, report: components['schemas']['JobHistory']): Promise<Status> {
    const device = await getDevice({ deviceId, relation: ['location'] });
    if (!device) {
        logger.error(`[processJobReport]: device not found`);
        throw new Error('Device not found');
    }

    const { jobId: submittedJobId, offlineJobId } = report;
    if (submittedJobId.length === 0 && (!offlineJobId || offlineJobId.length === 0)) {
        logger.error(`[processJobReport]: job id and offline job id cannot be empty`);
        await sendJobAnonmalyMessage(device, 'job id and offline job id cannot be empty');
        return 'processed';
    }

    const job = await getOrCreateJob({ device, offlineJobId, jobId: submittedJobId, relation: ['device', 'assignee', 'command'], report });
    if (!job) {
        logger.error(`[processJobReport]: job not found`);
        throw new Error('Job not found');
    }
    const { jobId } = job;

    const { detail, type } = report;
    if (job.deviceId !== deviceId) {
        logger.error(`[processJobReport]: device id mismatch`);
        throw new Error('Device id mismatch');
    }

    if (!job.assignee) {
        logger.error(`[processJobReport]: assignee not found`);
        throw new Error('Assignee not found');
    }

    const { assigneeUsername, status, treatment } = detail;
    if (!job.offlineJobId && job.assignee.username !== assigneeUsername) {
        logger.error(`[processJobReport]: assignee username mismatch. expected ${assigneeUsername} but got ${job.assignee.username}`);
        throw new Error('Assignee username mismatch');
    }

    // alert if report is outside of job specification
    const result = checkJob(job, report);
    if (result.length > 0) {
        logger.error(`[processJobReport]: job ${jobId} has difference: ${JSON.stringify(result)}`);
        if (!DISABLE_JOB_CHECK) {
            await sendJobDifferenceMessage(device, job, result);
        }
    }

    const plan = report.detail.treatment.detail.plan;
    const ultrasoundSnapshot = report.detail.treatment.detail.ultrasoundSnapshot;
    const hasUltrasoundTemperatureAnormalyResult = await isUltrasoundTemperatureAnormaly(job, plan, ultrasoundSnapshot);
    if (hasUltrasoundTemperatureAnormalyResult) {
        logger.error(`[processJobReport]: job ${jobId} has ultrasound temperatur anormaly`);
        await sendJobAnonmalyMessage(device, 'ultrasound temperatur anormaly', job.jobId);
    }

    logger.info(`[processJobReport]: process job report ${deviceId}...`);
    await addJobHistory({
        jobId,
        type,
        author: deviceId,
        record: {
            treatment,
            assigneeId: job.assigneeId,
            deviceId,
        },
    });

    const actualStatus = toStatus(status);
    if (actualStatus !== job.status) {
        logger.info(`[processJobReport]: update job ${jobId} to ${actualStatus}`);
        await updateJob({
            jobId,
            type,
            author: deviceId,
            update: {
                status: actualStatus,
            },
        });
    }
    return 'processed';
}

export async function processDeviceReport(deviceId: string, report: DeviceReportDetail['report']): Promise<Status> {
    if (Array.isArray(report)) {
        logger.info(`[processDeviceReport] process ${report.length} report for device ${deviceId}...`);
        for (const detail of report) {
            switch (detail.type) {
                case 'error':
                    await processErrorReport(deviceId, detail);
                    break;
                case 'completion':
                case 'interim':
                    await processJobReport(deviceId, {
                        ...detail,
                        detail: {
                            ...detail.detail,
                            // convert status to lowercase as master program submit status has uppercase
                            status: toStatus(detail.detail.status),
                        },
                    });
                    break;
            }
        }
        return 'processed';
    }
    switch (report.type) {
        case 'acknowledgement':
            logger.info(`[processDeviceReport] process device acknowledgement ${deviceId}...`);
            return processAcknowledgement(deviceId, report);
    }
}
