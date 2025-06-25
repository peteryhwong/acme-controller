import { getGroupsFromReq, hasGroup } from '@ankh/ankh-auth/lib/helpers';
import { Request, Response } from 'express';
import { HQ_GROUP } from '../component/constant';
import { getDateForResponse } from '../component/date';
import { logger } from '../component/logger';
import { getLocationById } from '../component/repository/location';
import { createUser as createUserToDb, getUserById, getUserByUsernumber, getUsers as getUsersFromDb, updateUser } from '../component/repository/user';
import { Job } from '../entity/job';
import { components, operations } from '../types/schema';

export async function getUsers(
    request: Request<any, any, any, operations['getUsers']['parameters']['query']>,
    response: Response<operations['getUsers']['responses']['200']['content']['application/json'] | components['schemas']['Error']>,
) {
    try {
        const { includeDeleted } = request.query;
        logger.info(`[getUsers]: get all users (includeDeleted: ${includeDeleted})`);
        const users = await getUsersFromDb({ groups: getGroupsFromReq(request), includeDeleted, relation: ['job'] });
        logger.info(`[getUsers]: found ${users.length} users`);
        const filteredUsers = users.filter(user => user.type !== 'internal');
        logger.info(`[getUsers]: found ${filteredUsers.length} users`);
        response.status(200).json({
            user: filteredUsers.map(({ userId, name, userNumber, location, job }) => ({
                userNumber,
                userId,
                name,
                createdAt: getDateForResponse(location.datetime),
                locationId: location.locationId,
                job: (job ?? []).map(({ jobId }) => ({ jobId })),
            })),
        });
    } catch (error) {
        logger.error(`[getUsers]: ${error.message}`);
        response.status(500).json({ error_code: '500', error_message: 'Internal Server Error' });
    }
}

export async function createUser(
    request: Request<any, any, operations['createUser']['requestBody']['content']['application/json'], any>,
    response: Response<operations['createUser']['responses']['201']['content']['application/json'] | components['schemas']['Error']>,
) {
    try {
        const { userNumber, name, locationId } = request.body;
        const existing = await getUserByUsernumber({ groups: getGroupsFromReq(request), userNumber });
        if (existing) {
            logger.error(`[createUser] user ${userNumber} already exists`);
            response.status(400).json({ error_code: '400', error_message: 'User already exists' });
            return;
        }
        const location = await getLocationById(locationId);
        if (!location) {
            logger.error(`[createUser] location ${locationId} not found`);
            response.status(400).json({ error_code: '400', error_message: 'Location not found' });
            return;
        }
        if (!hasGroup([HQ_GROUP])(request, location.group)) {
            logger.error(`[createUser] user not allowed to create user at ${location.name}`);
            response.status(403).json({ error_code: '403', error_message: 'Not allowed to create user at this location' });
            return;
        }
        logger.info(`[createUser] create user ${userNumber} at ${locationId}`);
        const user = await createUserToDb({
            userNumber,
            name,
            location,
            type: 'external',
        });
        response.status(201).json({
            userNumber,
            userId: user.userId,
            locationId,
            name,
            createdAt: getDateForResponse(user.datetime),
            job: [] as Pick<Job, 'jobId'>[],
        });
    } catch (err) {
        logger.error(`[createDevice]: ${err.message}`);
        response.status(500).json({ error_code: '500', error_message: 'Internal Server Error' });
    }
}

// update user location
export async function updateUserLocation(
    request: Request<operations['updateUserLocation']['parameters']['path']>,
    response: Response<operations['updateUserLocation']['responses']['200']['content']['application/json'] | components['schemas']['Error']>,
) {
    try {
        const { userId } = request.params;
        const { locationId } = request.body;
        logger.info(`[updateUserLocation] update user ${userId} location to ${locationId}`);
        const user = await getUserById({ groups: getGroupsFromReq(request), userId, relation: ['location'] });
        if (!user) {
            logger.error(`[updateUserLocation] user ${userId} not found`);
            response.status(404).json({ error_code: '404', error_message: 'User not found' });
            return;
        }
        const location = await getLocationById(locationId);
        if (!location) {
            logger.error(`[updateUserLocation] location ${locationId} not found`);
            response.status(404).json({ error_code: '404', error_message: 'Location not found' });
            return;
        }
        if (location.group !== user.location.group) {
            logger.error(`[updateUserLocation] user ${userId} cannot move to location ${locationId} because it is not in the same group`);
            response.status(403).json({ error_code: '403', error_message: 'Forbidden' });
            return;
        }
        await updateUser(userId, { location });
        logger.info(`[updateUserLocation] user ${userId} location updated`);
        response.status(200).json({
            userId,
        });
    } catch (err) {
        logger.error(`[updateUserLocation]: ${err.message}`);
        response.status(500).json({ error_code: '500', error_message: 'Internal Server Error' });
    }
}

// soft delete user by userId
export async function deleteUser(
    request: Request<operations['deleteUser']['parameters']['path']>,
    response: Response<operations['deleteUser']['responses']['200']['content']['application/json'] | components['schemas']['Error']>,
) {
    try {
        const { userId } = request.params;
        logger.info(`[deleteUser] delete user ${userId}`);
        const user = await getUserById({ groups: getGroupsFromReq(request), userId });
        if (!user) {
            logger.error(`[deleteUser] user ${userId} not found`);
            response.status(404).json({ error_code: '404', error_message: 'User not found' });
            return;
        }
        logger.info(`[deleteUser] delete user ${userId}`);
        await updateUser(user.userId, {
            deletedAt: new Date(),
        });
        response.status(200).json({
            userId,
        });
    } catch (err) {
        logger.error(`[deleteUser]: ${err.message}`);
        response.status(500).json({ error_code: '500', error_message: 'Internal Server Error' });
    }
}
