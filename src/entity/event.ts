import { Status } from '@ankh/ankh-queue/lib/type';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId, VersionColumn } from 'typeorm';
import { EventDetail, EventType } from '../types/event';
import { Device } from './device';

export function priority(type?: Event['type']): number {
    switch (type) {
        case 'heartbeat':
            return 100;
        case 'healthcheck':
            return 200;
        case 'ping':
            return 300;
        default:
            return 100000;
    }
}

@Entity('event')
export class Event {
    @PrimaryGeneratedColumn('uuid', { name: 'eventid' })
    eventId: string;

    @VersionColumn({ default: 1 })
    version: number;

    @CreateDateColumn({ name: 'datetime', type: 'datetime' })
    datetime: Date;

    @Column('text', { name: 'type', nullable: false })
    type: EventType;

    @Column('json', { name: 'detail', nullable: false })
    detail: EventDetail;

    @Column('varchar', { name: 'status', nullable: false, default: 'pending' })
    status: Status;

    @Column('text', { name: 'runnerid', nullable: true })
    runnerId: string;

    @Column('datetime', { name: 'schedule', nullable: true })
    schedule: Date | null;

    @Column('bigint', { name: 'starttime', nullable: true })
    startTime: number;

    @Column('bigint', { name: 'endtime', nullable: true })
    endTime: number;

    @Column('bigint', { name: 'duration', nullable: true })
    duration: number;

    @Column('integer', { name: 'priority', nullable: false, default: priority() })
    priority: number;

    @ManyToOne(() => Device, device => device.event)
    device: Device;

    @RelationId((event: Event) => event.device)
    deviceId: string;
}
