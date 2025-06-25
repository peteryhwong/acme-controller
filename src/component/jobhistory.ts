import * as lodash from 'lodash';
import { JobHistory } from '../entity/jobhistory';
import { HistoryDetail, UpdateJob } from '../types/jobhistory';
import { getDateForResponse } from './date';

export function areEqual(lhs: UpdateJob, rhs: UpdateJob) {
    return lodash.isEqual(lhs, rhs);
}

export function toJobHistory(jobId: string, jobHistory: JobHistory): HistoryDetail {
    const history: Omit<HistoryDetail, 'detail'> = {
        datetime: getDateForResponse(jobHistory.datetime),
        assigneeId: jobHistory.assigneeId,
        author: jobHistory.author,
        jobId,
        userId: jobHistory.userId,
        status: jobHistory.status,
        deviceId: jobHistory.deviceId,
        jobHistoryId: jobHistory.jobHistoryId,
        type: jobHistory.type,
    };
    const { detail } = jobHistory;
    if ('error' in detail) {
        // JobErrorDetail;
        return {
            ...history,
            detail,
        };
    } else if ('treatmentPlan' in detail) {
        // JobDetail
        return {
            ...history,
            detail,
        };
    } else {
        // JobSnapshotDetail
        return {
            ...history,
            detail,
        };
    }
}
