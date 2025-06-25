import * as client from './client';
import { LOCAL } from './constant';

// get locations
export async function getLocations(jwtToken: string) {
    const response = await client.getLocations({
        baseURL: LOCAL.controller.baseUrl,
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
    });
    expect(response.status).toEqual(200);
    if (response.data?.location === undefined) {
        throw new Error('response.data.location is undefined');
    }
    return response.data.location;
}

export async function getLocationId(jwtToken: string, name: string) {
    const locations = await getLocations(jwtToken);
    const location = locations.find(location => location.name === name);
    if (location === undefined) {
        throw new Error(`Location ${name} not found`);
    }
    return location.locationId;
}

export async function createLocation(jwtToken: string, name: string, check = true) {
    console.log(`Creating location ${name}`);
    const res = await client.createLocation({
        baseURL: LOCAL.controller.baseUrl,
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
        body: {
            name,
            group: 'ankh',
        },
    });
    console.log(JSON.stringify(res.data));
    if (check) {
        expect(res.data?.locationId).toBeDefined();
    }

    const locations = await client.getLocations({
        baseURL: LOCAL.controller.baseUrl,
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
    });
    if (check) {
        expect(locations.data?.location).toContainEqual({
            locationId: res.data?.locationId,
            group: 'ankh',
            name,
            device: [],
        });
    }

    if (!res.data) {
        throw new Error('res.data is not defined');
    }
    return res.data.locationId;
}

export async function deleteLocation(jwtToken: string, locationId: string) {
    const before = await client.getLocations({
        baseURL: LOCAL.controller.baseUrl,
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
    });
    expect(before.data?.location?.map(location => location.locationId)).toContainEqual(locationId);
    await client.deleteLocation({
        baseURL: LOCAL.controller.baseUrl,
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
        path: {
            locationId,
        },
    });
    const after = await client.getLocations({
        baseURL: LOCAL.controller.baseUrl,
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
    });
    expect(after.data?.location?.map(location => location.locationId)).not.toContainEqual(locationId);
}
