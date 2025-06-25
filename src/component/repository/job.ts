import { getConnection } from '@ankh/ankh-db/lib/connection';
import { getEntitiesBy, getEntityBy, QuerySpec, toRelationSpec, WhereSpec } from '@ankh/ankh-db/lib/util';
import { Assignee } from '../../entity/assignee';
import { Device } from '../../entity/device';
import { Job } from '../../entity/job';
import { JobHistory } from '../../entity/jobhistory';
import { User } from '../../entity/user';
import { InitialJobStatus, InputJobType, JobDetail, OutputJobType } from '../../types/job';
import { JobSnapshotDetail } from '../../types/jobhistory';
import { components } from '../../types/schema';
import { logger } from '../logger';
import { byDatetime } from '../sort';

export function toJobType(type: InputJobType): OutputJobType {
    switch (type) {
        case 'pro':
            return 'pronew';
        default:
            return type;
    }
}

export function toJobSnapshotDetail(detail: JobSnapshotDetail): JobSnapshotDetail {
    return {
        ...detail,
        treatment: {
            ...detail.treatment,
            type: toJobType(detail.treatment.type),
        },
    };
}

export function toJobDetail(detail: JobDetail): JobDetail {
    return {
        ...detail,
        treatmentPlan: {
            ...detail.treatmentPlan,
            type: toJobType(detail.treatmentPlan.type),
        },
    };
}

export function toQuerySpec(request: { groups?: string[]; offlineJobId?: string; jobId?: string[]; relation?: string[]; status?: string[] }): QuerySpec {
    const { groups, jobId, offlineJobId, relation: rawRelation, status } = request;
    const relation = rawRelation ?? [];
    const hasLocation = relation.includes('location');
    const relations = relation.filter(relation => relation !== 'location').map(toRelationSpec);
    if (groups || hasLocation) {
        if (!relation.includes('device')) {
            relations.push({
                inner: true,
                name: 'device',
            });
        }
        relations.push({
            inner: true,
            name: 'location',
            entity: 'device',
        });
    }
    const ids: WhereSpec[] = [];
    if (offlineJobId) {
        ids.push({
            identifierName: 'offlineJobId',
            identifier: [offlineJobId],
        });
    }
    if (groups) {
        ids.push({
            identifierName: 'group',
            identifier: groups,
            entity: 'location',
        });
    }
    if (jobId) {
        ids.push({
            identifierName: 'jobId',
            identifier: jobId,
        });
    }
    if (status) {
        ids.push({
            identifierName: 'status',
            identifier: status,
        });
    }
    return {
        ids,
        relations,
    };
}

export async function getJobs(request: { groups?: string[]; jobId?: string[]; relation?: string[]; status?: string[] }): Promise<Job[]> {
    return getEntitiesBy(Job, toQuerySpec(request));
}

export function getJob(request: { groups?: string[]; offlineJobId?: string; jobId?: string; relation?: string[] }) {
    const { groups, jobId, offlineJobId, relation } = request;
    if (jobId) {
        return getEntityBy(Job, toQuerySpec({ groups, jobId: [jobId], relation }));
    } else if (offlineJobId) {
        return getEntityBy(Job, toQuerySpec({ groups, offlineJobId, relation }));
    } else {
        return null;
    }
}

// create job in db
export async function createDeviceJob(req: { device: Device; assignee: Assignee; user: User; detail: JobDetail; status?: InitialJobStatus; offlineJobId?: string }): Promise<Job> {
    const { device, assignee, user, detail, status, offlineJobId } = req;
    return getConnection().transaction(async manager => {
        logger.info(`[createDeviceJob]: create job for device ${device.deviceId}`);
        const job = await manager.save(
            manager.create(Job, {
                detail: toJobDetail(detail),
                type: toJobType(detail.treatmentPlan.type),
                device,
                user,
                assignee,
                offlineJobId,
                status,
            }),
        );
        logger.info(`[createDeviceJob]: created job ${job.jobId} for device ${device.deviceId}`);
        return job;
    });
}

export async function updateJob(req: { jobId: string; author: string; type: Exclude<JobHistory['type'], 'error'>; update: Partial<Job> }) {
    const { jobId, author, type, update } = req;
    return await getConnection().transaction(async manager => {
        const job = await manager.findOne(Job, { where: { jobId }, relations: ['user', 'assignee', 'device', 'jobhistory'] });
        if (!job) {
            logger.error(`[updateJob]: job not found`);
            throw new Error(`[updateJob]: job not found`);
        }
        if (!job.jobhistory) {
            logger.error(`[updateJob]: job history not found`);
            throw new Error(`[updateJob]: job history not found`);
        }
        logger.info(`[updateJob]: update job ${jobId}`);
        const jobHistory = await manager.save(
            manager.create(JobHistory, {
                detail: toJobDetail(job.detail),
                status: job.status,
                assignee: job.assignee,
                user: job.user,
                device: job.device,
                author,
                type,
            }),
        );
        job.jobhistory.push(jobHistory);
        return await manager.save(Object.assign(job, update));
    });
}

export async function addJobHistory(req: { jobId: string; author: string; type: 'interim' | 'completion'; record: JobSnapshotDetail & { assigneeId: string; deviceId: string } }) {
    const { jobId, author, type, record } = req;
    return await getConnection().transaction(async manager => {
        const job = await manager.findOne(Job, { where: { jobId }, relations: ['user', 'assignee', 'device', 'jobhistory'] });
        if (!job) {
            logger.error(`[addJobHistory]: job not found`);
            throw new Error(`[addJobHistory]: job not found`);
        }
        if (!job.jobhistory) {
            logger.error(`[addJobHistory]: job history not found`);
            throw new Error(`[addJobHistory]: job history not found`);
        }
        logger.info(`[addJobHistory]: add job history for job ${jobId}`);
        const jobHistory = await manager.save(
            manager.create(JobHistory, {
                detail: toJobSnapshotDetail({
                    treatment: record.treatment,
                }),
                status: job.status,
                assignee: job.assignee,
                user: job.user,
                device: job.device,
                author,
                type,
            }),
        );
        job.jobhistory.push(jobHistory);
        return await manager.save(job);
    });
}

export async function addErrorJobHistory(req: { jobId: string; author: string; type: 'error'; error: components['schemas']['DeviceError'] }) {
    const { jobId, author, type, error } = req;
    return await getConnection().transaction(async manager => {
        const job = await manager.findOne(Job, { where: { jobId }, relations: ['user', 'assignee', 'device', 'jobhistory'] });
        if (!job) {
            logger.error(`[addErrorJob]: job not found`);
            throw new Error(`[addErrorJob]: job not found`);
        }
        if (!job.jobhistory) {
            logger.error(`[addErrorJob]: job history not found`);
            throw new Error(`[addErrorJob]: job history not found`);
        }
        logger.info(`[addErrorJob]: add job history for ${jobId}`);
        const jobHistory = await manager.save(
            manager.create(JobHistory, {
                detail: error,
                status: job.status,
                assignee: job.assignee,
                user: job.user,
                device: job.device,
                author,
                type,
            }),
        );
        job.jobhistory.push(jobHistory);
        return await manager.save(job);
    });
}

export async function getAscendingJobUltrasoundHistory(jobId: string): Promise<Pick<JobHistory, 'datetime' | 'detail'>[]> {
    const jobWithHistory = await getJob({ jobId, relation: ['jobhistory'] });
    if (!jobWithHistory) {
        logger.error(`[getAscendingJobUltrasoundHistory] job ${jobId} not found`);
        throw new Error(`[getAscendingJobUltrasoundHistory] job ${jobId} not found`);
    }
    return Array.isArray(jobWithHistory.jobhistory) ? jobWithHistory.jobhistory.sort(byDatetime) : [];
}
