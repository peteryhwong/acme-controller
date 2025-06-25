import { getGroupsFromReq, getUsername, hasRoles } from '@ankh/ankh-auth/lib/helpers';
import { Payload, SecurtyHandlerRequest } from '@ankh/ankh-auth/lib/type';
import { Request, Response } from 'express';
import { getDateForResponse } from '../component/date';
import { approveJob as approveJobLogic, createJob as createJobForDevice, getJobsInAscendingOrder, updateJob as updateJobById, updateJobStatus as updateJobStatusById } from '../component/job';
import { toJobHistory } from '../component/jobhistory';
import { logger } from '../component/logger';
import { getDevice } from '../component/repository/device';
import { getJob } from '../component/repository/job';
import { byDatetime } from '../component/sort';
import { Job } from '../entity/job';
import { components, operations } from '../types/schema';

function getJobStatusFilter<X extends Pick<Job, 'status'>>(request: SecurtyHandlerRequest & { jwtPayload?: Payload }) {
    if (hasRoles(request, ['platform_report', 'platform_admin', 'hq_admin'])) {
        return () => true;
    }
    return (job: X) => !['cancelled', 'complete'].includes(job.status);
}

// functions create and get jobs similar to commandcontroller
export async function getDeviceJobs(
    request: Request<operations['getDeviceJobs']['parameters']['path'], any, any, any>,
    response: Response<operations['getDeviceJobs']['responses']['200']['content']['application/json'] | components['schemas']['Error']>,
) {
    try {
        const deviceId = request.params.deviceId;
        logger.info(`[getDeviceJobs]: get jobs for device ${deviceId}`);
        const device = await getDevice({ deviceId, groups: getGroupsFromReq(request), relation: ['job'] });
        if (!device) {
            logger.error(`[getDeviceJobs]: device not found`);
            response.status(404).json({ error_code: '404', error_message: 'Invalid' });
            return;
        }
        const job = device.job ?? [];
        logger.info(`[getDeviceJobs]: found ${job.length} jobs`);
        const filteredJobs = job.filter(getJobStatusFilter(request));
        logger.info(`[getDeviceJobs]: filtered ${filteredJobs.length} jobs`);
        response.status(200).json({
            job: filteredJobs.sort(byDatetime).map(({ jobId, datetime, detail, status, userId, assigneeId, deviceId, offlineJobId }) => ({
                ...detail,
                jobId,
                status,
                userId,
                assigneeId,
                deviceId,
                datetime: getDateForResponse(datetime),
                offlineJobId: offlineJobId ?? undefined,
            })),
        });
    } catch (error) {
        logger.error(`[getDeviceJobs]: ${error.message}`);
        response.status(500).json({ error_code: '500', error_message: 'Internal Server Error' });
        return;
    }
}

// get all jobs
export async function getJobs(request: Request<any, any, any, any>, response: Response<operations['getJobs']['responses']['200']['content']['application/json'] | components['schemas']['Error']>) {
    try {
        logger.info(`[getJobs]: get all jobs`);
        const job = await getJobsInAscendingOrder({ groups: getGroupsFromReq(request) });
        logger.info(`[getJobs]: found ${job.length} jobs`);
        const filteredJobs = job.filter(getJobStatusFilter(request));
        logger.info(`[getJobs]: filtered ${filteredJobs.length} jobs`);
        response.status(200).json({
            job: filteredJobs,
        });
    } catch (error) {
        logger.error(`[getJobs]: ${error.message}`);
        response.status(500).json({ error_code: '500', error_message: 'Internal Server Error' });
        return;
    }
}

// get all pending approval jobs
export async function getPendingApprovalJobs(
    request: Request<any, any, any, any>,
    response: Response<operations['getPendingApprovalJobs']['responses']['200']['content']['application/json'] | components['schemas']['Error']>,
) {
    try {
        logger.info(`[getPendingApprovalJobs]: get all pending approval jobs`);
        const job = await getJobsInAscendingOrder({ groups: getGroupsFromReq(request), status: ['pendingApproval'] });
        logger.info(`[getPendingApprovalJobs]: found ${job.length} jobs`);
        response.status(200).json({
            job,
        });
    } catch (error) {
        logger.error(`[getPendingApprovalJobs]: ${error.message}`);
        response.status(500).json({ error_code: '500', error_message: 'Internal Server Error' });
        return;
    }
}

export async function getJobById(
    request: Request<operations['getJobById']['parameters']['path'], any, any, any>,
    response: Response<operations['getJobById']['responses']['200']['content']['application/json'] | components['schemas']['Error']>,
) {
    try {
        const jobId = request.params.jobId;
        logger.info(`[getJobById]: get job ${jobId}`);
        const job = await getJob({ groups: getGroupsFromReq(request), jobId, relation: ['device', 'assignee', 'jobhistory', 'user'] });
        if (!job) {
            logger.error(`[getJobById]: job not found`);
            response.status(404).json({ error_code: '404', error_message: 'Invalid' });
            return;
        }
        const { detail, status, assigneeId, userId, deviceId, jobhistory: jobhistoryRaw, offlineJobId } = job;
        if (!jobhistoryRaw) {
            logger.error(`[getJobById]: jobhistory not found`);
            response.status(404).json({ error_code: '404', error_message: 'Invalid' });
            return;
        }
        const jobHistory = jobhistoryRaw.sort(byDatetime).map(history => toJobHistory(jobId, history));
        logger.info(`[getJobById]: has ${jobHistory.length} job history entries ${JSON.stringify(jobHistory)}`);
        response.status(200).json({
            jobId,
            assigneeId,
            datetime: getDateForResponse(job.datetime),
            userId,
            treatmentPlan: detail.treatmentPlan,
            status,
            deviceId,
            jobHistory,
            offlineJobId: offlineJobId ?? undefined,
        });
    } catch (error) {
        logger.error(`[getJobById]: ${error.message}`);
        response.status(500).json({ error_code: '500', error_message: 'Internal Server Error' });
        return;
    }
}

// create job
export async function createJob(
    request: Request<operations['createJob']['parameters']['path'], any, operations['createJob']['requestBody']['content']['application/json'], any>,
    response: Response<operations['createJob']['responses']['201']['content']['application/json'] | components['schemas']['Error']>,
) {
    try {
        const deviceId = request.params.deviceId;
        logger.info(`[createJob]: create job for device ${deviceId}`);
        const result = await createJobForDevice(deviceId, request.body);
        if ('error_code' in result) {
            logger.error(`[createJob]: ${result.error_message}`);
            response.status(Number(result.error_code)).json(result);
            return;
        } else {
            logger.info(`[createJob]: created job ${result.jobId} for device ${deviceId}`);
            response.status(201).json(result);
        }
    } catch (error) {
        logger.error(`[createJob]: ${error.message}`);
        response.status(500).json({ error_code: '500', error_message: 'Internal Server Error' });
        return;
    }
}

export async function updateJob(
    request: Request<operations['updateJob']['parameters']['path'], any, operations['updateJob']['requestBody']['content']['application/json'], any>,
    response: Response<operations['updateJob']['responses']['200']['content']['application/json'] | components['schemas']['Error']>,
) {
    try {
        const jobId = request.params.jobId;
        const author = getUsername(request);
        if (!author) {
            logger.error(`[updateJob]: author not found`);
            response.status(401).json({ error_code: '401', error_message: 'Unauthorized' });
            return;
        }
        const result = await updateJobById(jobId, author, request.body, getGroupsFromReq(request));
        if ('error_code' in result) {
            response.status(Number(result.error_code)).json(result);
        } else {
            response.status(200).json(result);
        }
    } catch (error) {
        logger.error(`[updateJob]: ${error.message}`);
        response.status(500).json({ error_code: '500', error_message: 'Internal Server Error' });
        return;
    }
}

export async function updateJobStatus(
    request: Request<
        operations['updateJobStatus']['parameters']['path'],
        any,
        operations['updateJobStatus']['requestBody']['content']['application/json'],
        operations['updateJobStatus']['parameters']['query']
    >,
    response: Response<operations['updateJobStatus']['responses']['200']['content']['application/json'] | components['schemas']['Error']>,
) {
    try {
        const jobId = request.params.jobId;
        const { forceCommand } = request.query;
        const author = getUsername(request);
        if (!author) {
            logger.error(`[updateJobStatus]: author not found`);
            response.status(401).json({ error_code: '401', error_message: 'Unauthorized' });
            return;
        }
        const result = await updateJobStatusById({ jobId, author, req: request.body, groups: getGroupsFromReq(request), forceCommand });
        if ('error_code' in result) {
            response.status(Number(result.error_code)).json(result);
        } else {
            response.status(200).json(result);
        }
    } catch (error) {
        logger.error(`[updateJobStatus]: ${error.message}`);
        response.status(500).json({ error_code: '500', error_message: 'Internal Server Error' });
        return;
    }
}

// approveJob
export async function approveJob(
    request: Request<operations['approveJob']['parameters']['path'], any, operations['approveJob']['requestBody']['content']['application/json'], any>,
    response: Response<operations['approveJob']['responses']['200']['content']['application/json'] | components['schemas']['Error']>,
) {
    try {
        const jobId = request.params.jobId;
        const { approval } = request.body;
        const author = getUsername(request);
        if (!author) {
            logger.error(`[approveJob]: author not found`);
            response.status(401).json({ error_code: '401', error_message: 'Unauthorized' });
            return;
        }
        logger.info(`[approveJob]: approve job ${jobId}`);
        const result = await approveJobLogic(jobId, author, approval);
        response.status(200).json(result);
    } catch (error) {
        logger.error(`[approveJob]: ${error.message}`);
        response.status(500).json({ error_code: '500', error_message: 'Internal Server Error' });
    }
}
