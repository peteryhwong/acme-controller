import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, VersionColumn } from 'typeorm';
import { Assignee } from './assignee';
import { Device } from './device';
import { User } from './user';

@Entity('location')
@Unique(['name', 'group'])
export class Location {
    @PrimaryGeneratedColumn('uuid', { name: 'locationid' })
    locationId: string;

    @CreateDateColumn({ name: 'datetime', type: 'datetime' })
    datetime: Date;

    @VersionColumn({ default: 1 })
    version: number;

    @Column('varchar', { name: 'name', nullable: false })
    name: string;

    @Column('varchar', { name: 'group', nullable: true })
    group: string;

    @Column('datetime', { name: 'deletedat', nullable: true })
    deletedAt: Date;

    @OneToMany(() => Device, device => device.location, { eager: false })
    device: Device[];

    @OneToMany(() => Assignee, assignee => assignee.location, { eager: false })
    assignee: Assignee[];

    @OneToMany(() => User, user => user.location, { eager: false })
    user: User[];
}
