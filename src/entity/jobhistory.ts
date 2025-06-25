import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, RelationId, VersionColumn } from 'typeorm';
import { JobUpdateDetail } from '../types/jobhistory';
import { Assignee } from './assignee';
import { Device } from './device';
import { Job } from './job';
import { User } from './user';

@Entity('jobhistory')
export class JobHistory {
    @PrimaryGeneratedColumn('uuid', { name: 'jobhistoryid' })
    jobHistoryId: string;

    @VersionColumn({ default: 1 })
    version: number;

    @CreateDateColumn({ name: 'datetime', type: 'datetime' })
    datetime: Date;

    @Column('varchar', { name: 'author', nullable: false })
    author: string;

    @Column('varchar', { name: 'type', nullable: true })
    type: 'interim' | 'completion' | 'error' | 'platform';

    @Column('json', { name: 'detail', nullable: false })
    detail: JobUpdateDetail;

    @Column('varchar', { name: 'status', nullable: false, default: 'pending' })
    status: 'pendingapproval' | 'pending' | 'standby' | 'play' | 'frozen' | 'complete' | 'cancelled' | 'abnormal';

    @ManyToOne(() => User, user => user.jobHistory)
    user: User;

    @RelationId((jobhistory: JobHistory) => jobhistory.user)
    userId: string;

    @ManyToOne(() => Assignee, assignee => assignee.jobHistory)
    assignee: Assignee;

    @RelationId((jobhistory: JobHistory) => jobhistory.assignee)
    assigneeId: string;

    @ManyToOne(() => Device, device => device.jobHistory)
    device: Device;

    @RelationId((jobhistory: JobHistory) => jobhistory.device)
    deviceId: string;

    @ManyToMany(() => Job, job => job.jobhistory, { eager: false })
    job: Job[];
}
