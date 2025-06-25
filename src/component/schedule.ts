import { Moment, tz } from 'moment-timezone';
import { logger } from './logger';
import { TIMEZONE } from './constant';

export function nextSchedule(req: { start?: Moment; end?: Moment; intervalInMins: number }, now = tz(TIMEZONE)): Date {
    // if it is after end time then return next day's start time
    const { start, end, intervalInMins } = req;
    logger.info(`[nextSchedule] now ${now.toLocaleString()}, end ${end?.toLocaleString()}, next start ${start?.toLocaleString()}`);
    if (start && end && now.isAfter(end)) {
        logger.info(`[nextSchedule] now is after end time`);
        const next = start.toDate();
        logger.info(`[nextSchedule] next ${next.toLocaleString()}`);
        return next;
    } else {
        logger.info(`[nextSchedule] now is before end time`);
        const next = now.add(intervalInMins, 'minutes').toDate();
        logger.info(`[nextSchedule] next ${next.toLocaleString()}`);
        return next;
    }
}
