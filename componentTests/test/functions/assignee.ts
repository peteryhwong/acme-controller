import * as client from './client';
import { LOCAL } from './constant';

export async function createAssignee(jwtToken: string, username: string, locationId: string, password = '12345678') {
    const res = await client.createAssignee({
        baseURL: LOCAL.controller.baseUrl,
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
        body: {
            username,
            password,
            locationId,
            role: 'device_user',
        },
    });
    expect(res.data?.assigneeId).toBeDefined();
    const assignees = await client.getAssignees({
        baseURL: LOCAL.controller.baseUrl,
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
    });
    expect(assignees.data?.assignee).toContainEqual({
        assigneeId: res.data?.assigneeId,
        username,
        locationId,
        role: 'device_user',
    });
    if (!res.data?.assigneeId) {
        throw new Error('create assignee failed');
    }
    return res.data.assigneeId;
}

// change password
export async function changePassword(jwtToken: string, assigneeId: string, newPassword: string) {
    const res = await client.updateAssigneePassword({
        baseURL: LOCAL.controller.baseUrl,
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
        path: {
            assigneeId,
        },
        body: {
            password: newPassword,
        },
    });
    expect(res.status).toEqual(200);
    if (!res.data) {
        throw new Error('change password failed');
    }
    return res.data;
}

// delete assignee
export async function deleteAssignee(jwtToken: string, assigneeId: string) {
    const res = await client.deleteAssignee({
        baseURL: LOCAL.controller.baseUrl,
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
        path: {
            assigneeId,
        },
    });
    expect(res.status).toEqual(200);
    const assignees = await client.getAssignees({
        baseURL: LOCAL.controller.baseUrl,
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
    });
    expect(assignees.data?.assignee.map(assignee => assignee.assigneeId)).not.toContainEqual(assigneeId);
}

// update assignee location
export async function updateAssigneeLocation(jwtToken: string, assigneeId: string, locationId: string) {
    const result = await client.updateAssigneeLocation({
        baseURL: LOCAL.controller.baseUrl,
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
        path: {
            assigneeId,
        },
        body: {
            locationId,
        },
    });
    expect(result.status).toEqual(200);
    if (!result.data) {
        throw new Error('result.data is not defined');
    }
    return result.data;
}
