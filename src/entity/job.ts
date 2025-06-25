import { Column, CreateDateColumn, Entity, Generated, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId, VersionColumn } from 'typeorm';
import { JobDetail } from '../types/job';
import { Assignee } from './assignee';
import { Command } from './command';
import { Device } from './device';
import { JobHistory } from './jobhistory';
import { User } from './user';

@Entity('job')
export class Job {
    @PrimaryGeneratedColumn('uuid', { name: 'jobid' })
    jobId: string;

    @VersionColumn({ default: 1 })
    version: number;

    @CreateDateColumn({ name: 'datetime', type: 'datetime' })
    datetime: Date;

    @Generated('increment')
    @Column({ name: 'number', unique: true, nullable: false })
    number: number;

    @Column('varchar', { name: 'offlinejobid', nullable: true })
    offlineJobId: string | null;

    @Column('varchar', { name: 'type', nullable: false })
    type: 'pro' | 'pronew';

    @Column('json', { name: 'detail', nullable: false })
    detail: JobDetail;

    @Column('varchar', { name: 'status', nullable: false, default: 'pending' })
    status: 'pendingapproval' | 'pending' | 'standby' | 'play' | 'frozen' | 'complete' | 'cancelled' | 'abnormal';

    @ManyToOne(() => Assignee, assignee => assignee.job)
    assignee?: Assignee;

    @RelationId((job: Job) => job.assignee)
    assigneeId: string;

    @ManyToOne(() => Device, device => device.job)
    device?: Device;

    @RelationId((job: Job) => job.device)
    deviceId: string;

    @ManyToOne(() => User, user => user.job)
    user?: User;

    @RelationId((job: Job) => job.user)
    userId: string;

    @OneToMany(() => Command, command => command.job, { eager: false })
    command?: Command[];

    @ManyToMany(() => JobHistory, jobhistory => jobhistory.job, { eager: false })
    @JoinTable()
    jobhistory?: JobHistory[];
}
