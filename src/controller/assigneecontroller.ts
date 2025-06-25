import { getGroupsFromReq, hasGroup } from '@ankh/ankh-auth/lib/helpers';
import { Request, Response } from 'express';
import { DEFAULT_ASSIGNEE_ROLE, HQ_GROUP } from '../component/constant';
import { logger } from '../component/logger';
import { createAssignee as createAssigneeToDb, getAssigneeById, getAssigneeByUsername, getAssignees as getAssigneesFromDb, updateAssignee } from '../component/repository/assignee';
import { getLocationById } from '../component/repository/location';
import { components, operations } from '../types/schema';

export async function getAssignees(
    request: Request<any, any, any, operations['getAssignees']['parameters']['query']>,
    response: Response<operations['getAssignees']['responses']['200']['content']['application/json'] | components['schemas']['Error']>,
) {
    try {
        const { includeDeleted } = request.query;
        logger.info(`[getAssignees]: get all assignees (includeDeleted:${includeDeleted})`);
        const assignees = await getAssigneesFromDb({ groups: getGroupsFromReq(request), includeDeleted, relation: ['location', 'job'] });
        logger.info(`[getAssignees]: found ${assignees.length} assignees`);
        const filteredAssignees = assignees.filter(assignee => assignee.type !== 'internal');
        logger.info(`[getAssignees]: filtered ${filteredAssignees.length} assignees`);
        response.status(200).json({
            assignee: filteredAssignees.map(({ assigneeId, username, location, role }) => ({
                assigneeId,
                username,
                role: role ?? DEFAULT_ASSIGNEE_ROLE,
                locationId: location.locationId,
            })),
        });
    } catch (error) {
        logger.error(`[getAssignees]: ${error.message}`);
        response.status(500).json({ error_code: '500', error_message: 'Internal Server Error' });
    }
}

export async function createAssignee(
    request: Request<any, any, operations['createAssignee']['requestBody']['content']['application/json'], any>,
    response: Response<operations['createAssignee']['responses']['201']['content']['application/json'] | components['schemas']['Error']>,
) {
    try {
        const { username, password: passcode, locationId, role } = request.body;
        const existing = await getAssigneeByUsername({ username, groups: getGroupsFromReq(request) });
        if (existing) {
            logger.error(`[createAssignee] assignee ${username} already exists`);
            response.status(400).json({ error_code: '400', error_message: 'Assignee already exists' });
            return;
        }
        const location = await getLocationById(locationId);
        if (!location) {
            logger.error(`[createAssignee] location ${locationId} not found`);
            response.status(400).json({ error_code: '400', error_message: 'Location not found' });
            return;
        }
        if (!hasGroup([HQ_GROUP])(request, location.group)) {
            logger.error(`[createAssignee] user does not have permission to create assignee at ${locationId}`);
            response.status(403).json({ error_code: '403', error_message: 'Forbidden' });
            return;
        }
        logger.info(`[createAssignee] create assignee ${username} at ${locationId}`);
        const assignee = await createAssigneeToDb({
            username,
            passcode,
            location,
            role,
            type: 'external',
        });
        response.status(201).json({
            assigneeId: assignee.assigneeId,
            locationId,
            username: assignee.username,
            role: assignee.role ?? DEFAULT_ASSIGNEE_ROLE,
        });
    } catch (err) {
        logger.error(`[createDevice]: ${err.message}`);
        response.status(500).json({ error_code: '500', error_message: 'Internal Server Error' });
    }
}

export async function updateAssigneePassword(
    request: Request<operations['updateAssigneePassword']['parameters']['path'], any, operations['updateAssigneePassword']['requestBody']['content']['application/json'], any>,
    response: Response<operations['updateAssigneePassword']['responses']['200']['content']['application/json'] | components['schemas']['Error']>,
) {
    try {
        const { assigneeId } = request.params;
        const assignee = await getAssigneeById({ assigneeId, groups: getGroupsFromReq(request) });
        if (!assignee) {
            logger.error(`[updateAssigneePassword] assignee ${assigneeId} not found`);
            response.status(404).json({ error_code: '404', error_message: 'Assignee not found' });
            return;
        }
        logger.info(`[updateAssigneePassword] update assignee ${assigneeId} password`);
        await updateAssignee(assigneeId, { password: request.body.password });
        logger.info(`[updateAssigneePassword] assignee ${assigneeId} password updated`);
        response.status(200).json({
            assigneeId: assignee.assigneeId,
        });
    } catch (err) {
        logger.error(`[updateAssigneePassword]: ${err.message}`);
        response.status(500).json({ error_code: '500', error_message: 'Internal Server Error' });
    }
}

// update assignee location
export async function updateAssigneeLocation(
    request: Request<operations['updateAssigneeLocation']['parameters']['path'], any, operations['updateAssigneeLocation']['requestBody']['content']['application/json'], any>,
    response: Response<operations['updateAssigneeLocation']['responses']['200']['content']['application/json'] | components['schemas']['Error']>,
) {
    try {
        const { assigneeId } = request.params;
        const assignee = await getAssigneeById({ assigneeId, groups: getGroupsFromReq(request), relation: ['location'] });
        if (!assignee) {
            logger.error(`[updateAssigneeLocation] assignee ${assigneeId} not found`);
            response.status(404).json({ error_code: '404', error_message: 'Assignee not found' });
            return;
        }
        logger.info(`[updateAssigneeLocation] update assignee ${assigneeId} location`);
        if (request.body.locationId === assignee.location.locationId) {
            logger.info(`[updateAssigneeLocation] assignee ${assigneeId} location is already ${request.body.locationId}`);
            response.status(200).json({
                assigneeId: assignee.assigneeId,
            });
            return;
        }
        const location = await getLocationById(request.body.locationId);
        if (!location) {
            logger.error(`[updateAssigneeLocation] location ${request.body.locationId} not found`);
            response.status(404).json({ error_code: '404', error_message: 'Location not found' });
            return;
        }
        if (location.group !== assignee.location.group) {
            logger.error(`[updateAssigneeLocation] assignee ${assigneeId} cannot move to location ${request.body.locationId} because it is not in the same group`);
            response.status(403).json({ error_code: '403', error_message: 'Forbidden' });
            return;
        }
        await updateAssignee(assigneeId, { location });
        logger.info(`[updateAssigneeLocation] assignee ${assigneeId} location updated`);
        response.status(200).json({
            assigneeId: assignee.assigneeId,
        });
    } catch (err) {
        logger.error(`[updateAssigneeLocation]: ${err.message}`);
        response.status(500).json({ error_code: '500', error_message: 'Internal Server Error' });
    }
}

// soft delete an assignee by setting deletedAt to now
export async function deleteAssignee(
    request: Request<operations['deleteAssignee']['parameters']['path'], any, any, any>,
    response: Response<operations['deleteAssignee']['responses']['200']['content']['application/json'] | components['schemas']['Error']>,
) {
    try {
        const { assigneeId } = request.params;
        logger.info(`[deleteAssignee] delete assignee ${assigneeId}`);
        const assignee = await getAssigneeById({ assigneeId, groups: getGroupsFromReq(request) });
        if (!assignee) {
            logger.error(`[deleteAssignee] assignee ${assigneeId} not found`);
            response.status(404).json({ error_code: '404', error_message: 'Assignee not found' });
            return;
        }
        await updateAssignee(assigneeId, { deletedAt: new Date() });
        logger.info(`[deleteAssignee] assignee ${assigneeId} deleted`);
        response.status(200).json({
            assigneeId: assignee.assigneeId,
        });
    } catch (err) {
        logger.error(`[deleteAssignee]: ${err.message}`);
        response.status(500).json({ error_code: '500', error_message: 'Internal Server Error' });
    }
}
