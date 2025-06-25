import { getConnection } from '@ankh/ankh-db/lib/connection';
import { connect } from '@ankh/ankh-db/lib/db';
import { CORRELATION_ID } from '@ankh/ankh-http/lib/constant';
import { addContext } from '@ankh/ankh-http/lib/context';
import { EMPTY_BUFFER, IntegrationTaskProcessor, waitFor } from '@ankh/ankh-queue/lib/taskprocessor';
import { Integration, Processor, Status } from '@ankh/ankh-queue/lib/type';
import { FindOneOptions, In, IsNull, LessThanOrEqual, Not, Repository } from 'typeorm';
import { Event } from '../entity/event';
import { eventTypes, EventWrapper } from '../types/event';
import { APPLICATION_NAME, INTERVAL_CHECK_LOCKED_SHUTDOWN_MS, QUEUE_POLLING_INTERVAL_MS, TRIAL_CHECK_LOCKED_SHUTDOWN } from './constant';
import { dbConfig } from './db';
import { processDeviceReport } from './devicereport';
import { healthcheck } from './healthcheck';
import { sendErrorMessage } from './integration/slack';
import { logger } from './logger';
import { ping } from './ping';
import { findById, lockEvent as lockEventRepo } from './repository/event';
import { nextHeartbeat } from './repository/heartbeat';

function wrapEvent(event: Event): EventWrapper {
    return {
        taskId: event.eventId,
        type: event.type,
        status: event.status,
        callback: '',
        detail: {
            callback: undefined,
        },
        original: event,
        runnerId: event.runnerId,
        startTime: event.startTime,
        duration: event.duration,
        endTime: event.endTime,
    };
}

async function findEvent(eventRepository: Repository<Event>, option: FindOneOptions<Event>): Promise<EventWrapper | undefined> {
    const event = await eventRepository.findOne(option);
    return event ? wrapEvent(event) : undefined;
}

async function lockEvent(eventWrapper: EventWrapper): Promise<EventWrapper | undefined> {
    const event = eventWrapper.original;
    const manager = getConnection().createEntityManager();
    logger.info(`[lockEvent] Locking event ${event.eventId}`);
    const result = await lockEventRepo(manager, event, eventWrapper.runnerId);
    logger.info(`[lockEvent] Locking result ${result}`);
    if (result) {
        const newEvent = await findById(manager, event.eventId);
        if (newEvent) {
            return wrapEvent(newEvent);
        } else {
            return undefined;
        }
    } else {
        logger.warn(`Cannot lock event ${event.eventId}`);
        return undefined;
    }
}

const findNextEvent = (status: Status): FindOneOptions<Event> => {
    if (status === 'pending') {
        return {
            where: [
                {
                    status: 'pending',
                    schedule: IsNull(),
                },
                {
                    status: 'pending',
                    schedule: LessThanOrEqual(new Date()),
                },
            ],
            order: {
                datetime: 'ASC',
            },
        };
    } else {
        return {
            where: {
                status: status,
            },
            order: {
                datetime: 'ASC',
            },
        };
    }
};

export async function process(wrap: { original: Pick<Event, 'detail' | 'eventId' | 'type'> }) {
    const task = wrap.original;
    logger.info(`[process] Processing ${JSON.stringify(task.detail)}`);
    try {
        switch (task.type) {
            case 'ping':
                return await ping();
            case 'healthcheck':
                return await healthcheck();
            case 'heartbeat':
                return await nextHeartbeat();
            case 'devicereport':
                logger.info(`[process] Processing device report ${JSON.stringify(task.detail)}`);
                if ('deviceId' in task.detail && 'report' in task.detail) {
                    const { deviceId, report } = task.detail;
                    return await processDeviceReport(deviceId, report);
                }
                logger.error(`[process] Invalid device report ${JSON.stringify(task.detail)}`);
                throw new Error(`[process] Invalid device report ${JSON.stringify(task.detail)}`);
            default:
                logger.error(`[process] Unknown task type ${task.type}`);
                throw new Error(`[process] Cannot handle task ${task.eventId} (${JSON.stringify(task.detail)})`);
        }
    } catch (err) {
        logger.error(`[process] Failed to process task ${task.eventId} (${JSON.stringify(task.detail)}): ${err.message}`);
        sendErrorMessage(`[process] Failed to process task ${task.eventId} (${JSON.stringify(task.detail)}): ${err.message}`);
        return 'error';
    }
}

const processors = eventTypes.reduce((map, type) => map.set(type, process), new Map<Event['type'], Processor<EventWrapper>>());
const configuration: Integration<EventWrapper> = {
    name: APPLICATION_NAME,
    callback: async () => true,
    insert: async task => task,
    checkDirectory: '/some/random/path',
    checkProgress: async () => 'processed', // Always processed
    downloadData: async () => EMPTY_BUFFER, // Empty buffer
    queueConfig: {
        interval: QUEUE_POLLING_INTERVAL_MS,
        parallel: 1,
    },
    logger,
    processors,
    getTaskById: async id => findEvent(getConnection().getRepository(Event), { where: { eventId: id, status: Not('locked') }, loadRelationIds: true }),
    getTaskByStatus: async status => findEvent(getConnection().getRepository(Event), findNextEvent(status)),
    lockTask: lockEvent,
    updateTask: async outevent => {
        const repo = getConnection().getRepository(Event);
        const updatedEvent = await repo.findOne({
            where: {
                eventId: outevent.original.eventId,
            },
        });
        const event = updatedEvent ?? outevent.original;
        event.status = outevent.status;
        event.runnerId = outevent.runnerId;
        event.startTime = outevent.startTime;
        event.endTime = outevent.endTime;
        event.duration = outevent.duration;
        await repo.save(event);
    },
    cleanup: async () => {
        return;
    },
    shutDown: async runnerId => {
        const repo = getConnection().getRepository(Event);
        logger.info(`Wait locked tasks to be processed`);
        await waitFor(
            () =>
                repo.find({
                    where: {
                        runnerId,
                        status: In(['locked']),
                    },
                }),
            locked => locked.length > 0,
            INTERVAL_CHECK_LOCKED_SHUTDOWN_MS,
            TRIAL_CHECK_LOCKED_SHUTDOWN,
            logger,
        );
        const locked = await repo.find({
            where: {
                runnerId,
                status: In(['locked']),
            },
        });
        logger.info(`Set ${locked.length} locked events run by ${runnerId} back to pending`);
        if (locked.length > 0) {
            locked.forEach(w => (w.status = 'pending'));
            await repo.save(locked);
        }
        return false;
    },
    listen: async (event, status) => {
        switch (status) {
            case 'start':
                addContext(CORRELATION_ID, event.taskId);
                logger.addContext(CORRELATION_ID, event.taskId);
                return;
            case 'end':
                addContext(CORRELATION_ID, '');
                logger.addContext(CORRELATION_ID, '');
                return;
        }
    },
};

class EventProcessor extends IntegrationTaskProcessor<EventWrapper> {
    constructor(configuration: Integration<EventWrapper>) {
        super(configuration);
    }
    async handleException(_exp: any): Promise<boolean> {
        await connect(dbConfig);
        return false;
    }
}

export const eventProcessor = new EventProcessor(configuration);
