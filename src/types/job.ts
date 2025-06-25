import { components } from './schema';

export type InputJobType = components['schemas']['BaseJob']['treatmentPlan']['type'];

export type OutputJobType = Exclude<InputJobType, 'pro'>;

export type JobDetail = components['schemas']['BaseJob'];

export interface JobDifference {
    type: string;
    expect: string | object | number;
    actual: string | object | number;
}

export type JobStatus = components['schemas']['JobHistory']['detail']['status'];

export type LowercaseJobStatus = Exclude<JobStatus, 'pause' | 'Pause' | 'Abnormal' | 'Complete' | 'Cancel' | 'cancel' | 'Frozen' | 'Play' | 'Abnormal' | 'Standby'>;

export type InitialJobStatus = 'pending' | 'play' | 'pendingapproval';
