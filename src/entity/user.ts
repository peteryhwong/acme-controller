import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, VersionColumn } from 'typeorm';
import { Location } from './location';
import { Job } from './job';
import { JobHistory } from './jobhistory';

@Entity('user')
@Unique(['userNumber', 'location'])
export class User {
    @PrimaryGeneratedColumn('uuid', { name: 'userid' })
    userId: string;

    @CreateDateColumn({ name: 'datetime', type: 'datetime' })
    datetime: Date;

    @VersionColumn({ default: 1 })
    version: number;

    @Column('varchar', { name: 'usernumber', nullable: false })
    userNumber: string;

    @Column('varchar', { name: 'name', nullable: false })
    name: string;

    @Column('varchar', { name: 'type', nullable: true })
    type: 'internal' | 'external';

    @Column('datetime', { name: 'deletedat', nullable: true })
    deletedAt: Date;

    @ManyToOne(() => Location, location => location.user)
    location: Location;

    @OneToMany(() => Job, job => job.user, { eager: false })
    job: Job[];

    @OneToMany(() => JobHistory, jobHistory => jobHistory.user, { eager: false })
    jobHistory: JobHistory[];
}
