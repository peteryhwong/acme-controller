import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TreatmentPlan } from './treatmentplan';

@Entity('treatmentplanhistory')
export class TreatmentPlanHistory {
    @PrimaryGeneratedColumn('uuid', { name: 'treatmentplanhistoryid' })
    treatmentPlanHistoryId: string;

    @Column('integer', { name: 'version', nullable: false })
    version: number;

    @CreateDateColumn({ name: 'datetime', type: 'datetime' })
    datetime: Date;

    @Column('json', { name: 'detail', nullable: false })
    detail: { ultrasound: number; tens: number };

    @Column('varchar', { name: 'author', nullable: false })
    author: string;

    @ManyToOne(() => TreatmentPlan, treatmentPlan => treatmentPlan.treatmentPlanHistory)
    treatmentPlan: TreatmentPlan;
}
