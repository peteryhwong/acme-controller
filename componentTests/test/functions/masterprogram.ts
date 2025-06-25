import * as client from './client';
import { LOCAL } from './constant';

// get programs
export async function getMasterPrograms(jwtToken: string) {
    const masterPrograms = await client.getMasterPrograms({
        baseURL: LOCAL.controller.baseUrl,
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
    });
    if (!masterPrograms.data) {
        throw new Error(`[getMasterPrograms] failed to get master programs`);
    }
    return masterPrograms.data;
}
