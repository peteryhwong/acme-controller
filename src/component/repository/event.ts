import { getConnection } from '@ankh/ankh-db/lib/connection';
import { EntityManager } from '@ankh/ankh-db/lib/type';
import { Event, priority } from '../../entity/event';
import { DeviceReportDetail } from '../../types/event';
import { logger } from '../logger';
import { Device } from '../../entity/device';

export function findById(manager: EntityManager, eventId: string) {
    return manager.getRepository(Event).findOne({ where: { eventId } });
}

export async function lockEvent(manager: EntityManager, event: Event, runnerId: string) {
    try {
        const result = await manager
            .getRepository(Event)
            .createQueryBuilder()
            .update({ status: 'locked', runnerId })
            .where('eventid = :eventId', { eventId: event.eventId })
            .andWhere('version = :version', { version: event.version })
            .execute();
        return result.affected === 1;
    } catch (err) {
        logger.error(`[lockEvent] fail to lock event ${event.eventId}: ${err.message}`);
        throw err;
    }
}

export function getEvents(manager: EntityManager, req: { statuses?: string[] | undefined; from: number; size: number; type?: Event['type'] }): Promise<Event[]> {
    const { from, size, statuses, type } = req;
    const qb = manager.createQueryBuilder().select('event').from(Event, 'event');
    if (statuses) {
        qb.andWhere(`status IN (:...statuses)`, {
            statuses,
        });
    }

    if (type) {
        qb.andWhere(`type = :type`, {
            type,
        });
    }

    qb.take(size).skip(from).orderBy({
        datetime: 'DESC',
    });

    return qb.getMany();
}

export function getHeartbeatEvents(manager: EntityManager, interval: number): Promise<Event[]> {
    return manager.query(`
        SELECT * FROM ac_control.event
        WHERE
            schedule < NOW() - INTERVAL '${interval + 1} MINUTE AND
            status = 'pending' AND
            type = 'heartbeat'
        ;
    `);
}

export function createCheckEvent(manager: EntityManager, type: Exclude<Event['type'], 'devicereport'>, schedule: Date) {
    return manager.save(
        manager.create(Event, {
            type,
            schedule,
            priority: priority(type),
            detail: {},
        }),
    );
}

export function createDeviceEvent(manager: EntityManager, device: Device, report: DeviceReportDetail['report'], schedule?: Date): Promise<Pick<Event, 'eventId'>> {
    return manager.save(
        manager.create(Event, {
            type: 'devicereport',
            schedule,
            priority: priority('devicereport'),
            detail: {
                deviceId: device.deviceId,
                report,
            },
            device,
        }),
    );
}

export function createDeviceEventInDb(device: Device, report: DeviceReportDetail['report'], schedule?: Date): Promise<Pick<Event, 'eventId'>> {
    return createDeviceEvent(getConnection().createEntityManager(), device, report, schedule);
}
