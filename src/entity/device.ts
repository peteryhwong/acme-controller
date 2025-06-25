import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, VersionColumn } from 'typeorm';
import { Command } from './command';
import { DeviceHistory } from './devicehistory';
import { Event } from './event';
import { Job } from './job';
import { JobHistory } from './jobhistory';
import { Location } from './location';

@Entity('device')
@Unique(['code', 'location'])
export class Device {
    @PrimaryGeneratedColumn('uuid', { name: 'deviceid' })
    deviceId: string;

    @VersionColumn({ default: 1 })
    version: number;

    @CreateDateColumn({ name: 'datetime', type: 'datetime' })
    datetime: Date;

    @Column('varchar', { name: 'code', nullable: false })
    code: string;

    @Column('varchar', { name: 'type', nullable: false })
    type: string;

    @Column('text', { name: 'hash', nullable: false })
    hash: string;

    @Column('varchar', { name: 'status', nullable: false, default: 'offline' })
    status: 'online' | 'offline' | 'unknown';

    @Column('varchar', { name: 'masterprogramversion', nullable: true })
    masterProgramVersion?: string;

    @Column('datetime', { name: 'deletedat', nullable: true })
    deletedAt: Date;

    @OneToMany(() => Job, job => job.device, { eager: false })
    job: Job[];

    @OneToMany(() => JobHistory, jobHistory => jobHistory.device, { eager: false })
    jobHistory: JobHistory[];

    @OneToMany(() => DeviceHistory, deviceHistory => deviceHistory.device, { eager: false })
    deviceHistory: DeviceHistory[];

    @OneToMany(() => Command, command => command.device, { eager: false })
    command: Command[];

    @OneToMany(() => Event, event => event.device, { eager: false })
    event?: Event[];

    @ManyToOne(() => Location, location => location.device)
    location: Location;
}
