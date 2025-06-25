import * as client from './client';
import { LOCAL } from './constant';

export async function approveJob(jwtToken: string, jobId: string, approval: boolean) {
    const res = await client.approveJob({
        baseURL: LOCAL.controller.baseUrl,
        path: {
            jobId,
        },
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
        body: {
            approval,
        },
    });
    if (!res.data) {
        console.log(res.error);
        throw new Error('No data');
    }
    return res.data;
}

export async function getJobRequiresApproval(jwtToken: string) {
    const result = await client.getPendingApprovalJobs({
        baseURL: LOCAL.controller.baseUrl,
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
    });
    if (!result.data?.job) {
        console.log(result.error);
        throw new Error('No data');
    }
    return result.data.job;
}
