import { getConnection } from '@ankh/ankh-db/lib/connection';
import { Status } from '@ankh/ankh-queue/lib/type';
import * as moment from 'moment-timezone';
import { API, TIMEZONE } from '../constant';
import { sendErrorMessage } from '../integration/slack';
import { logger } from '../logger';
import { createCheckEvent, getHeartbeatEvents } from './event';

const HEARTBEAT_INTERVAL_MINUTES = Number(API.poll.heartbeat.interval_mins);

export async function nextHeartbeat(): Promise<Status> {
    try {
        const schedule = moment().tz(TIMEZONE).add(HEARTBEAT_INTERVAL_MINUTES, 'minutes').toDate();
        const event = await createCheckEvent(getConnection().createEntityManager(), 'heartbeat', schedule);
        logger.info(`[nextHeartbeat] schedule next heartbeat at ${schedule.toISOString()} (EventId ${event.eventId})`);
        return 'processed';
    } catch (err) {
        logger.error(`[nextHeartbeat] fail to schedule next heartbeat: ${err}`);
        sendErrorMessage(`[nextHeartbeat] fail to schedule next heartbeat: ${err}`);
        return 'error';
    }
}

export async function validateHeartbeat() {
    const events = await getHeartbeatEvents(getConnection().createEntityManager(), HEARTBEAT_INTERVAL_MINUTES);
    return events.length === 0;
}
