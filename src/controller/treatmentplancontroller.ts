import { getGroupsFromReq, getUsername, hasGroup } from '@ankh/ankh-auth/lib/helpers';
import { Request, Response } from 'express';
import { HQ_GROUP } from '../component/constant';
import { getDateForResponse } from '../component/date';
import { logger } from '../component/logger';
import { getAllTreatmentPlans, getTreatmentPlanById as getTreatmentPlanByIdFromDb } from '../component/repository/treatmentplan';
import { createTreatmentPlansForGroup, updateTreatmentPlan as updateTreatmentPlanFun } from '../component/treatmentplan';
import { TreatmentPlan } from '../entity/treatmentplan';
import { components, operations } from '../types/schema';

function toTreatmentPlansResponse(treatmentPlans: TreatmentPlan[]): components['schemas']['TreatmentPlanWithVersionAndName'][] {
    return treatmentPlans
        .sort((l, r) => l.name.localeCompare(r.name))
        .map(({ treatmentPlanId, group, name, type, datetime, tens, ultrasound, version }) => ({
            type,
            name,
            group,
            treatmentPlanId,
            updatedAt: getDateForResponse(datetime),
            plan: {
                tens,
                ultrasound,
            },
            version: version.toString(),
        }));
}

// createTreatmentPlan
export async function createTreatmentPlan(
    request: Request<operations['createTreatmentPlan']['parameters']['path'], any, operations['createTreatmentPlan']['requestBody']['content']['application/json'], any>,
    response: Response<operations['createTreatmentPlan']['responses']['201']['content']['application/json'] | components['schemas']['Error']>,
) {
    try {
        // create treatment plan
        const group = request.params.group;
        const treatmentPlanRequest = request.body;
        const author = getUsername(request);
        if (!author) {
            logger.error(`[createTreatmentPlan]: author not found`);
            response.status(401).json({ error_code: '401', error_message: 'Unauthorized' });
            return;
        }
        if (!treatmentPlanRequest.type) {
            logger.error(`[createTreatmentPlan]: type not found`);
            response.status(400).json({ error_code: '400', error_message: 'Bad Request' });
            return;
        }
        logger.info(`[createTreatmentPlan] create treatment plans ${JSON.stringify(treatmentPlanRequest)} for group ${group}`);
        const treatmentPlans = await createTreatmentPlansForGroup(group, treatmentPlanRequest);
        // return treatment plan
        response.status(201).json({
            treatmentplan: toTreatmentPlansResponse(treatmentPlans),
        });
    } catch (error) {
        logger.error('[createTreatmentPlan] error creating treatment plan', error);
        response.status(500).json({ error_code: '500', error_message: 'Internal Server Error' });
    }
}

// get treatment plan by name
export async function getTreatmentPlanById(
    request: Request<operations['getTreatmentPlanById']['parameters']['path'], any, any, any>,
    response: Response<operations['getTreatmentPlanById']['responses']['200']['content']['application/json'] | components['schemas']['Error']>,
) {
    try {
        // get treatment plan
        const treatmentPlanId = request.params.treatmentPlanId;
        logger.info(`[getTreatmentPlanByName] get treatment plan ${treatmentPlanId}`);
        const treatmentPlan = await getTreatmentPlanByIdFromDb(treatmentPlanId, ['treatmentPlanHistory']);
        if (!treatmentPlan) {
            logger.error(`[getTreatmentPlanByName] treatment plan ${treatmentPlanId} not found`);
            response.status(404).json({ error_code: '404', error_message: 'Not Found' });
            return;
        }
        if (!hasGroup([HQ_GROUP])(request, treatmentPlan.group)) {
            logger.error(`[getTreatmentPlanByName] author not allowed`);
            response.status(403).json({ error_code: '403', error_message: 'Forbidden' });
            return;
        }
        logger.info(`[getTreatmentPlanByName] got treatment plan ${treatmentPlanId}`);
        // return treatment plan
        response.status(200).json({
            history: treatmentPlan.treatmentPlanHistory.map(({ datetime, author, version, detail }) => ({
                author,
                updatedAt: getDateForResponse(datetime),
                version: version.toString(),
                type: treatmentPlan.type,
                plan: {
                    tens: detail.tens,
                    ultrasound: detail.ultrasound,
                },
            })),
            treatmentPlanId: treatmentPlan.treatmentPlanId,
            group: treatmentPlan.group,
            name: treatmentPlan.name,
            updatedAt: getDateForResponse(treatmentPlan.datetime),
            version: treatmentPlan.version.toString(),
            plan: {
                tens: treatmentPlan.tens,
                ultrasound: treatmentPlan.ultrasound,
            },
            type: treatmentPlan.type,
        });
    } catch (error) {
        logger.error('[getTreatmentPlanByName] error getting treatment plan', error);
        response.status(500).json({ error_code: '500', error_message: 'Internal Server Error' });
    }
}

// get treatment plan
export async function getTreatmentPlan(request: Request, response: Response<operations['getTreatmentPlan']['responses']['200']['content']['application/json'] | components['schemas']['Error']>) {
    try {
        // get treatment plan
        logger.info('[getTreatmentPlan] get treatment plan');
        const treatmentPlan = await getAllTreatmentPlans({ group: getGroupsFromReq(request, [HQ_GROUP]) });
        // log the number of treatment plans returned using template
        logger.info('[getTreatmentPlan] got ' + treatmentPlan.length + ' treatment plans');
        // return treatment plan
        response.status(200).json({
            treatmentplan: toTreatmentPlansResponse(treatmentPlan),
        });
    } catch (error) {
        logger.error('[getTreatmentPlan] error getting treatment plan', error);
        response.status(500).json({ error_code: '500', error_message: 'Internal Server Error' });
    }
}

// update a treatment plan
export async function updateTreatmentPlan(
    request: Request<operations['updateTreatmentPlan']['parameters']['path'], any, operations['updateTreatmentPlan']['requestBody']['content']['application/json'], any>,
    response: Response<operations['updateTreatmentPlan']['responses']['200']['content']['application/json'] | components['schemas']['Error']>,
) {
    try {
        // update treatment plan
        const treatmentPlanId = request.params.treatmentPlanId;
        const treatmentPlan = request.body;
        const author = getUsername(request);
        if (!author) {
            logger.error(`[updateTreatmentPlan]: author not found`);
            response.status(401).json({ error_code: '401', error_message: 'Unauthorized' });
            return;
        }
        const plan = await getTreatmentPlanByIdFromDb(treatmentPlanId);
        if (!plan) {
            logger.error(`[updateTreatmentPlan]: treatment plan not found`);
            response.status(404).json({ error_code: '404', error_message: 'Not Found' });
            return;
        }
        if (!hasGroup([HQ_GROUP])(request, plan.group)) {
            logger.error(`[updateTreatmentPlan]: author not allowed`);
            response.status(403).json({ error_code: '403', error_message: 'Forbidden' });
            return;
        }
        logger.info('[updateTreatmentPlan] update treatment plan ' + treatmentPlanId + 'with ' + JSON.stringify(treatmentPlan));
        const updatedPlan = await updateTreatmentPlanFun(treatmentPlanId, plan.name, author, treatmentPlan);
        response.status(200).json({
            treatmentPlanId: updatedPlan.treatmentPlanId,
            name: updatedPlan.name,
            group: updatedPlan.group,
            updatedAt: getDateForResponse(updatedPlan.datetime),
            version: updatedPlan.version.toString(),
            type: updatedPlan.type,
            plan: {
                tens: updatedPlan.tens,
                ultrasound: updatedPlan.ultrasound,
            },
        });
    } catch (error) {
        logger.error('[updateTreatmentPlan] error updating treatment plan', error);
        response.status(500).json({ error_code: '500', error_message: 'Internal Server Error' });
    }
}
