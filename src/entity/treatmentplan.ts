import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn, VersionColumn } from 'typeorm';
import { TreatmentPlanHistory } from './treatmentplanhistory';

@Entity('treatmentplan')
@Unique(['name', 'group'])
export class TreatmentPlan {
    @PrimaryGeneratedColumn('uuid', { name: 'treatmentplanid' })
    treatmentPlanId: string;

    @UpdateDateColumn({ name: 'datetime', type: 'datetime' })
    datetime: Date;

    @VersionColumn({ default: 1 })
    version: number;

    @Column('varchar', { name: 'name', nullable: false })
    name: string;

    @Column('varchar', { name: 'type', nullable: false })
    type: 'pronew';

    @Column('integer', { name: 'ultrasound', nullable: false })
    ultrasound: number;

    @Column('integer', { name: 'tens', nullable: false })
    tens: number;

    @Column('varchar', { name: 'group', nullable: false })
    group: string;

    @OneToMany(() => TreatmentPlanHistory, treatmentPlanHistory => treatmentPlanHistory.treatmentPlan, { eager: false })
    treatmentPlanHistory: TreatmentPlanHistory[];
}
