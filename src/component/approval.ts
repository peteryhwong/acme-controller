import { Job } from '../entity/job';
import { components } from '../types/schema';
import { TREATMENT } from './constant';
import { getTodayDate } from './date';
import { logger } from './logger';
import { getUserById } from './repository/user';

export function isOverTensLimit(type: keyof typeof TREATMENT.approval.tens, value: number) {
    if (TREATMENT.approval.tens[type].disabled !== 'true') {
        logger.info(`[checkTensLimit]: ${type} limit is enabled`);
        return value > Number(TREATMENT.approval.tens[type].value);
    }
    return false;
}

export function doesTensIntensityLimitRequireApproval(tensSetting: components['schemas']['TensSetting']) {
    return Object.values(tensSetting.intensitylimit).some(intensity => isOverTensLimit('intensity_limit', intensity));
}

export function isCreatedAt(job: Pick<Job, 'datetime' | 'status'>, date: Date) {
    return job.status === 'complete' && job.datetime.getTime() >= date.getTime();
}

export function getTensParts(tensSetting: components['schemas']['TensSetting']) {
    return Object.values(tensSetting.channel).filter(Boolean).length;
}

export async function hasUserReachedDailyTensLimit(tensSetting: components['schemas']['TensSetting'], userId: string) {
    const plannedParts = getTensParts(tensSetting);
    if (isOverTensLimit('daily_parts_limit', plannedParts)) {
        logger.warn(`[hasUserReachedDailyTensLimit]: planned parts ${plannedParts} is greater than approval limit`);
        return true;
    }
    logger.info(`[hasUserReachedDailyTensLimit]: planned parts ${plannedParts} is less than approval limit`);
    const userWithJob = await getUserById({ userId, relation: ['job'] });
    if (!userWithJob || !userWithJob.job) {
        logger.warn(`[hasUserReachedDailyTensLimit]: user ${userId} has no job`);
        throw new Error(`user ${userId} has no job`);
    }
    const today = getTodayDate();
    const completedParts = userWithJob.job.filter(job => isCreatedAt(job, today)).reduce((parts, job) => parts + getTensParts(job.detail.treatmentPlan.detail.tensSetting), 0);
    logger.info(`[hasUserReachedDailyTensLimit]: user ${userId} has ${completedParts} completed parts today`);
    return isOverTensLimit('daily_parts_limit', completedParts + plannedParts);
}

export async function doesJobRequireApproval(tensSetting: components['schemas']['TensSetting'], userId: string) {
    if (doesTensIntensityLimitRequireApproval(tensSetting)) {
        logger.info(`[doesJobRequireApproval]: tens intensity limit requires approval`);
        return true;
    }
    logger.info(`[doesJobRequireApproval]: tens intensity limit does not require approval`);
    if (await hasUserReachedDailyTensLimit(tensSetting, userId)) {
        logger.info(`[doesJobRequireApproval]: user ${userId} has reached daily tens parts limit`);
        return true;
    }
    logger.info(`[doesJobRequireApproval]: user ${userId} has not reached daily tens parts limit`);
    return false;
}
