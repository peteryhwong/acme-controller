import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, VersionColumn } from 'typeorm';
import { DeviceHistoryDetail } from '../types/devicehistory';
import { Device } from './device';

@Entity('devicehistory')
export class DeviceHistory {
    @PrimaryGeneratedColumn('uuid', { name: 'devicehistoryid' })
    deviceHistoryId: string;

    @VersionColumn({ default: 1 })
    version: number;

    @CreateDateColumn({ name: 'datetime', type: 'datetime' })
    datetime: Date;

    @Column('json', { name: 'detail', nullable: false })
    detail: DeviceHistoryDetail;

    @ManyToOne(() => Device, device => device.deviceHistory)
    device: Device;
}
