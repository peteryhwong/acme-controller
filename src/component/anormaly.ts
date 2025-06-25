import { Job } from '../entity/job';
import { components } from '../types/schema';
import { isUltrasoundRunning } from './check';
import { TREATMENT } from './constant';
import { logger } from './logger';
import { getAscendingJobUltrasoundHistory } from './repository/job';

export function isJobActiveAndUltrasoundRunning(
    job: Pick<Job, 'status'>,
    plan: components['schemas']['ProSnapshot']['plan'],
    ultrasoundSnapshot: Pick<components['schemas']['UltrasoundSnapshot'], 'time'>,
) {
    return job.status === 'play' && typeof plan !== 'string' && isUltrasoundRunning(plan, ultrasoundSnapshot);
}

export function getTimeInMs(date: Date | string) {
    if (typeof date === 'string') {
        return Date.parse(date);
    }
    return date.getTime();
}

export async function hasUltrasoundTemperatureAnormaly(
    job: Pick<Job, 'jobId' | 'status'>,
    plan: components['schemas']['ProSnapshot']['plan'],
    ultrasoundSnapshot: Pick<components['schemas']['UltrasoundSnapshot'], 'temperature' | 'time'>,
    anormalyDurationInSeconds: number,
) {
    // check if ultrasound is running and has intensity 0 for more than 300 seconds

    // check if ultrasound is running
    if (!isJobActiveAndUltrasoundRunning(job, plan, ultrasoundSnapshot)) {
        return false;
    }

    // check if ultrasound has been running for at least anormalyDurationInSeconds
    const time = ultrasoundSnapshot.time;
    const earliestUnderConsiderationInMs = Date.now() - anormalyDurationInSeconds * 1000;
    if (!time || getTimeInMs(time.startedAt) > earliestUnderConsiderationInMs) {
        return false;
    }

    // check if ultrasound temperature is 0
    if (ultrasoundSnapshot.temperature > 0) {
        return false;
    }

    // check if ultrasound intensity is 0 for more than anormalyDurationInSeconds
    const ascendingHistory = await getAscendingJobUltrasoundHistory(job.jobId);
    do {
        const history = ascendingHistory.pop();
        if (!history) {
            return false;
        }
        const detail = history.detail;
        if (!('treatment' in detail)) {
            continue;
        }
        if (detail.treatment.detail.ultrasoundSnapshot.temperature > 0) {
            return false;
        }
        if (history.datetime.getTime() <= earliestUnderConsiderationInMs) {
            logger.info(`[hasUltrasoundIntensityAnormaly] job ${job.jobId} has ultrasound temperature 0 for more than ${anormalyDurationInSeconds} seconds`);
            return true;
        }
    } while (ascendingHistory.length > 0);
    return false;
}

export async function isUltrasoundTemperatureAnormaly(
    job: Pick<Job, 'jobId' | 'status'>,
    plan: components['schemas']['ProSnapshot']['plan'],
    ultrasoundSnapshot: Pick<components['schemas']['UltrasoundSnapshot'], 'temperature' | 'time'>,
) {
    if (TREATMENT.anomalies.ultrasound.zero_temperature_duration_seconds.disabled !== 'true') {
        return await hasUltrasoundTemperatureAnormaly(job, plan, ultrasoundSnapshot, Number(TREATMENT.anomalies.ultrasound.zero_temperature_duration_seconds.value));
    } else {
        return false;
    }
}

export async function hasUltrasoundOverheatAnormaly(job: Pick<Job, 'jobId' | 'status'>, report: Pick<components['schemas']['ErrorHistory'], 'detail'>, anormalyDurationInSeconds: number) {
    if (job.status !== 'play') {
        return false;
    }
    if (report.detail.error !== 'ultrasoundOverheat') {
        return false;
    }
    const earliestUnderConsiderationInMs = Date.now() - anormalyDurationInSeconds * 1000;
    if (getTimeInMs(report.detail.startedAt) <= earliestUnderConsiderationInMs && !report.detail.endedAt) {
        logger.info(`[hasUltrasoundOverheatAnormaly] job ${job.jobId} has ultrasound overheat for more than ${anormalyDurationInSeconds} seconds`);
        return true;
    }
    const errorDuration = report.detail.endedAt ? getTimeInMs(report.detail.endedAt) - getTimeInMs(report.detail.startedAt) : 0;
    if (errorDuration > anormalyDurationInSeconds * 1000) {
        logger.info(`[hasUltrasoundOverheatAnormaly] job ${job.jobId} has ultrasound overheat for more than ${anormalyDurationInSeconds} seconds`);
        return true;
    }
    const ascendingHistory = await getAscendingJobUltrasoundHistory(job.jobId);
    do {
        const history = ascendingHistory.pop();
        if (!history) {
            return false;
        }
        const detail = history.detail;
        if (!('error' in detail)) {
            continue;
        }
        if (report.detail.error !== 'ultrasoundOverheat') {
            return false;
        }
        if (history.datetime.getTime() <= earliestUnderConsiderationInMs) {
            logger.info(`[hasUltrasoundOverheatAnormaly] job ${job.jobId} has ultrasound overheat for more than ${anormalyDurationInSeconds} seconds`);
            return true;
        }
    } while (ascendingHistory.length > 0);
    return false;
}

export async function isUltrasoundOverheatAnormaly(job: Pick<Job, 'jobId' | 'status'>, report: Pick<components['schemas']['ErrorHistory'], 'detail'>) {
    if (TREATMENT.anomalies.ultrasound.overheat_duration_seconds.disabled !== 'true') {
        return await hasUltrasoundOverheatAnormaly(job, report, Number(TREATMENT.anomalies.ultrasound.overheat_duration_seconds.value));
    } else {
        return false;
    }
}
