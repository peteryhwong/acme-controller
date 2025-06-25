import { getGroupsFromReq, hasGroup } from '@ankh/ankh-auth/lib/helpers';
import { Request, Response } from 'express';
import { HQ_GROUP } from '../component/constant';
import { logger } from '../component/logger';
import { createLocation as createLocationInDb, findLocationByName, getAllLocations, getLocationById, updateLocation } from '../component/repository/location';
import { components, operations } from '../types/schema';

// create location
export async function createLocation(
    request: Request<any, any, operations['createLocation']['requestBody']['content']['application/json'], any>,
    response: Response<operations['createLocation']['responses']['201']['content']['application/json'] | components['schemas']['Error']>,
) {
    try {
        const { name, group } = request.body;
        if (!hasGroup([HQ_GROUP])(request, group)) {
            logger.error(`[createLocation] user does not have group ${group}`);
            response.status(403).json({ error_code: '403', error_message: 'Forbidden' });
            return;
        }
        const location = await findLocationByName(name, group);
        if (location) {
            logger.error(`[createLocation] location ${name} already exists for group ${group}`);
            response.status(400).json({ error_code: '400', error_message: 'Location already exists' });
            return;
        }
        logger.info(`[createLocation] create location ${name}`);
        const { locationId, device } = await createLocationInDb(name, group);
        logger.info(`[createLocation] location ${name} created, id: ${locationId}`);
        response.status(201).json({
            locationId,
            group,
            name,
            device: (device ?? []).map(({ deviceId }) => ({ deviceId })),
        });
    } catch (error) {
        logger.error(`[createLocation] ${error.message}`);
        response.status(500).json({ error_code: '500', error_message: 'Internal Server Error' });
    }
}

// get all locations
export async function getLocations(
    request: Request<any, any, any, operations['getLocations']['parameters']['query']>,
    response: Response<operations['getLocations']['responses']['200']['content']['application/json'] | components['schemas']['Error']>,
) {
    try {
        const { includeDeleted } = request.query;
        logger.info(`[getLocations]: get all locations, includeDeleted: ${includeDeleted}`);
        const locations = await getAllLocations({ groups: getGroupsFromReq(request), relation: ['device'] }, includeDeleted);
        logger.info(`[getLocations]: found ${locations.length} locations`);
        response.status(200).json({
            location: locations.map(({ device, locationId, name, group }) => ({
                locationId,
                name,
                group,
                device: (device ?? []).map(({ deviceId }) => ({ deviceId })),
            })),
        });
    } catch (error) {
        logger.error(`[getLocations]: ${error.message}`);
        response.status(500).json({ error_code: '500', error_message: 'Internal Server Error' });
    }
}

// soft delete location by locationId
export async function deleteLocation(
    request: Request<operations['deleteLocation']['parameters']['path']>,
    response: Response<operations['deleteLocation']['responses']['200']['content']['application/json'] | components['schemas']['Error']>,
) {
    try {
        const { locationId } = request.params;
        logger.info(`[deleteLocation]: delete location ${locationId}`);
        const location = await getLocationById(locationId);
        if (!location) {
            logger.error(`[deleteLocation]: location ${locationId} not found`);
            response.status(404).json({ error_code: '404', error_message: 'Location not found' });
            return;
        }
        if (!hasGroup([HQ_GROUP])(request, location.group)) {
            logger.error(`[deleteLocation]: user does not have permission to delete location ${locationId}`);
            response.status(403).json({ error_code: '403', error_message: 'Forbidden' });
            return;
        }
        logger.info(`[deleteLocation]: delete location ${locationId}`);
        await updateLocation(locationId, {
            deletedAt: new Date(),
        });
        logger.info(`[deleteLocation]: location ${locationId} deleted`);
        response.status(200).json({
            locationId,
        });
    } catch (error) {
        logger.error(`[deleteLocation]: ${error.message}`);
        response.status(500).json({ error_code: '500', error_message: 'Internal Server Error' });
    }
}
