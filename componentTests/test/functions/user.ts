import * as client from './client';
import { LOCAL } from './constant';

export async function createUser(jwtToken: string, name: string, userNumber: string, locationId: string) {
    const res = await client.createUser({
        baseURL: LOCAL.controller.baseUrl,
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
        body: {
            name,
            userNumber,
            locationId,
        },
    });
    expect(res.data?.userId).toBeDefined();
    const users = await client.getUsers({
        baseURL: LOCAL.controller.baseUrl,
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
    });
    expect(users.data?.user?.map(user => user.userId)).toContainEqual(res.data?.userId);
    expect(users.data?.user?.map(user => user.userNumber)).toContainEqual(userNumber);
    expect(users.data?.user?.map(user => user.name)).toContainEqual(name);
    expect(users.data?.user?.map(user => user.locationId)).toContainEqual(locationId);
    if (!res.data?.userId) {
        throw new Error('create user failed');
    }
    return res.data.userId;
}

// delete user
export async function deleteUser(jwtToken: string, userId: string) {
    const res = await client.deleteUser({
        baseURL: LOCAL.controller.baseUrl,
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
        path: {
            userId,
        },
    });
    expect(res.status).toEqual(200);
    const users = await client.getUsers({
        baseURL: LOCAL.controller.baseUrl,
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
    });
    expect(users.data?.user?.map(user => user.userId)).not.toContainEqual(userId);
}

// update user location
export async function updateUserLocation(jwtToken: string, userId: string, locationId: string) {
    const result = await client.updateUserLocation({
        baseURL: LOCAL.controller.baseUrl,
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
        path: {
            userId,
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
