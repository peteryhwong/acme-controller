import { Column, CreateDateColumn, Entity, Generated, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, VersionColumn } from 'typeorm';
import { Job } from './job';
import { JobHistory } from './jobhistory';
import { Location } from './location';

@Entity('assignee')
@Unique(['username', 'location'])
export class Assignee {
    @PrimaryGeneratedColumn('uuid', { name: 'assigneeid' })
    assigneeId: string;

    @CreateDateColumn({ name: 'datetime', type: 'datetime' })
    datetime: Date;

    @VersionColumn({ default: 1 })
    version: number;

    @Generated('increment')
    @Column({ name: 'number', unique: true, nullable: false })
    number: number;

    @Column('varchar', { name: 'username', nullable: false })
    username: string;

    @Column('varchar', { name: 'type', nullable: true })
    type: 'internal' | 'external';

    @Column('varchar', { name: 'hash', nullable: false })
    hash: string;

    @Column('varchar', { name: 'role', nullable: true })
    role: 'device_user' | 'device_maintenance' | 'device_admin' | null;

    @Column('datetime', { name: 'deletedat', nullable: true })
    deletedAt: Date;

    @ManyToOne(() => Location, location => location.assignee)
    location: Location;

    @OneToMany(() => Job, job => job.assignee, { eager: false })
    job: Job[];

    @OneToMany(() => JobHistory, jobHistory => jobHistory.assignee, { eager: false })
    jobHistory: JobHistory[];
}
