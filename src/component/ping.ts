import { getConnection } from '@ankh/ankh-db/lib/connection';
import { Status } from '@ankh/ankh-queue/lib/type';
import * as moment from 'moment-timezone';
import { API, EXCLUDE_DEVICES, INCLUDE_DEVICES, TIMEZONE } from './constant';
import { sendErrorMessage } from './integration/slack';
import { logger } from './logger';
import { createCommand } from './repository/command';
import { getDevices } from './repository/device';
import { createCheckEvent } from './repository/event';
import { nextSchedule } from './schedule';

const PING_INTERVAL_MINUTES = Number(API.poll.ping.interval_mins);
// API.poll.ping.end_time is 17:00:00. PING_END_TIME should be today at API.poll.ping.end_time
const PING_END_DATE_TIME = moment().tz(TIMEZONE).startOf('day').add(API.poll.ping.end_time, 'minutes');
// API.poll.ping.start_time is 09:00:00. PING_START_TIME should be next day at API.poll.ping.start_time
const PING_START_DATE_TIME = moment().tz(TIMEZONE).startOf('day').add(1, 'day').add(API.poll.ping.start_time, 'minutes');

export async function nextPing(): Promise<Status> {
    try {
        const schedule = nextSchedule({
            intervalInMins: PING_INTERVAL_MINUTES,
            start: PING_START_DATE_TIME,
            end: PING_END_DATE_TIME,
        });
        const event = await createCheckEvent(getConnection().createEntityManager(), 'ping', schedule);
        logger.info(`[nextPing] scheduled next ping ${event.eventId} for ${schedule.toISOString()}`);
        return 'processed';
    } catch (err) {
        logger.error(`[nextPing] error ${err.message}`);
        await sendErrorMessage(`[nextPing] error ${err.message}`);
        return 'error';
    }
}

export async function ping() {
    logger.info('[ping]: get devices');
    const allDevices = await getDevices({ includeDeleted: false });
    logger.info(`[ping]: got ${allDevices.length} devices`);
    const onlineDevices = allDevices
        .filter(device => device.status === 'online')
        .filter(device => !EXCLUDE_DEVICES.includes(device.code))
        .filter(device => (INCLUDE_DEVICES.length > 0 ? INCLUDE_DEVICES.includes(device.code) : true));
    logger.info(`[ping]: got ${onlineDevices.length} devices after excluding ${EXCLUDE_DEVICES.join(',')} and including ${INCLUDE_DEVICES.join(',')}`);
    for (const device of onlineDevices) {
        logger.info(`[ping]: ping device ${device.deviceId}(${device.code})`);
        const command = await createCommand(device, {
            command: 'ping',
        });
        logger.info(`[ping]: created command ${command.commandId} for device ${device.deviceId}`);
    }
    return await nextPing();
}
