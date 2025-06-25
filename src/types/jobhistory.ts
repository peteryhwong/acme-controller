import { JobDetail } from './job';
import { components, operations } from './schema';

export type TreatmentPlan = JobDetail['treatmentPlan'];

export type JobSnapshotDetail = Pick<components['schemas']['JobHistory']['detail'], 'treatment'>;

export type JobErrorDetail = components['schemas']['DeviceError'];

export type TreatmentSnapshot = JobSnapshotDetail['treatment'];

export type JobUpdateDetail = JobDetail | JobSnapshotDetail | JobErrorDetail;

export type HistoryDetail = components['schemas']['BaseJobWithJobIdAndStatusAndAssigneeAndDeviceIdAndHistory']['jobHistory'][0];

export type UpdateJob = operations['updateJob']['requestBody']['content']['application/json'];
