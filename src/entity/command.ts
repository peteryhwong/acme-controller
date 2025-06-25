import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, VersionColumn } from 'typeorm';
import { CommandDetail } from '../types/command';
import { Device } from './device';
import { Job } from './job';

@Entity('command')
export class Command {
    @PrimaryGeneratedColumn('uuid', { name: 'commandid' })
    commandId: string;

    @VersionColumn({ default: 1 })
    version: number;

    @CreateDateColumn({ name: 'datetime', type: 'datetime' })
    datetime: Date;

    @Column('json', { name: 'detail', nullable: false })
    detail: CommandDetail;

    @Column('varchar', { name: 'status', nullable: false, default: 'pending' })
    status: 'pending' | 'pending-processing' | 'acknowledged';

    @ManyToOne(() => Device, device => device.command)
    device: Device;

    @ManyToOne(() => Job, job => job.command)
    job: Job;
}
