import * as client from './client';
import { LOCAL } from './constant';
import { DEFAULT_TREATMENT_PLAN } from './treatment';

export async function createDeviceJob(jwtToken: string, opt: { deviceId: string; assigneeId: string; userId: string; treatmentPlan?: client.BaseJob['treatmentPlan'] }) {
    const { deviceId, assigneeId, userId, treatmentPlan } = opt;
    const body = {
        assigneeId,
        userId,
        treatmentPlan: treatmentPlan ?? DEFAULT_TREATMENT_PLAN,
    };
    console.log(JSON.stringify(body));
    const res = await client.createJob({
        baseURL: LOCAL.controller.baseUrl,
        path: {
            deviceId,
        },
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
        body,
    });
    if (!res.data?.jobId) {
        console.error(res.error);
        throw new Error('Failed to create job');
    }
    return res.data.jobId;
}

export async function getJob(jwtToken: string, jobId: string) {
    const res = await client.getJobById({
        baseURL: LOCAL.controller.baseUrl,
        path: {
            jobId,
        },
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
    });
    if (!res.data) {
        throw new Error('get job failed');
    }
    return res.data;
}

// get all jobs
export async function getJobs(jwtToken: string) {
    const res = await client.getJobs({
        baseURL: LOCAL.controller.baseUrl,
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
    });
    if (!res.data?.job) {
        throw new Error('get jobs failed');
    }
    return res.data.job;
}

// update a job
export async function updateJob(jwtToken: string, jobId: string, opt: client.BaseJobWithAssigneeWithDeviceId) {
    const res = await client.updateJob({
        baseURL: LOCAL.controller.baseUrl,
        path: {
            jobId,
        },
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
        body: opt,
    });
    if (!res.data) {
        throw new Error('update job failed');
    }
    return res.data;
}

export async function updateJobStatus(jwtToken: string, job: string, status: client.JobUpdateStatus['status'], forceCommand?: boolean) {
    const res = await client.updateJobStatus({
        baseURL: LOCAL.controller.baseUrl,
        path: {
            jobId: job,
        },
        query: {
            forceCommand,
        },
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
        body: {
            status,
        },
    });
    if (!res.data) {
        throw new Error('update job status failed');
    }
    return res.data;
}
