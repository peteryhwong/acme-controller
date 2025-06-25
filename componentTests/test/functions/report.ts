import { basicAuth } from './basic';
import * as client from './client';
import { LOCAL } from './constant';
import { createTreatmentSnapshot } from './treatment';

export async function createDeviceReport(
    deviceCode: string,
    jobHistory: Omit<client.JobHistory, 'detail'> & { detail: Omit<client.JobHistory['detail'], 'treatment'> },
    treatment?: client.TreatmentSnapshot,
) {
    const body = {
        detail: [
            {
                ...jobHistory,
                detail: {
                    ...jobHistory.detail,
                    treatment: treatment ?? createTreatmentSnapshot(),
                },
            },
        ],
    };
    console.log(JSON.stringify(body));
    const res = await client.createDeviceReportWithKey({
        baseURL: LOCAL.controller.baseUrl,
        headers: {
            Authorization: basicAuth(`${deviceCode}@ankh`, '12345678'),
        },
        body,
    });
    expect(res.data?.code).toEqual(201);
    expect(res.data?.message).toEqual('Report created');
    if (!res.data?.object?.reportId) {
        throw new Error(`no reportId found`);
    }
    return res.data.object.reportId;
}
