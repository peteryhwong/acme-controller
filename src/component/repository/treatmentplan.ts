import { getConnection } from '@ankh/ankh-db/lib/connection';
import { getEntitiesBy, getEntity } from '@ankh/ankh-db/lib/util';
import { TreatmentPlan } from '../../entity/treatmentplan';
import { TreatmentPlanHistory } from '../../entity/treatmentplanhistory';
import { logger } from '../logger';

// get all treatment plans
export function getAllTreatmentPlans(request: { group?: string[]; name?: string[]; relation?: string[] }) {
    const { name, relation, group } = request;
    const ids: { identifierName: string; identifier: string[]; entity?: string }[] = [];
    if (Array.isArray(group) && group.length > 0) {
        ids.push({
            identifierName: 'group',
            identifier: group,
        });
    }
    if (name) {
        ids.push({ identifierName: 'name', identifier: name });
    }
    return getEntitiesBy(TreatmentPlan, {
        ids,
        relations: (relation ?? []).map(name => ({
            name,
        })),
    });
}

// get treatment plans as records
export async function getTreatmentPlanMap(request: { name?: string[]; relation?: string[] }) {
    const plans = await getAllTreatmentPlans(request);
    return plans.reduce<Record<string, TreatmentPlan>>((map, plan) => {
        map[plan.name] = plan;
        return map;
    }, {});
}

export function getTreatmentPlanByName(name: string, relation: string[] = []): Promise<TreatmentPlan | null> {
    return getEntity(TreatmentPlan, { identifier: name, identifierName: 'name', relation });
}

export function getTreatmentPlanById(treatmentPlanId: string, relation: string[] = []): Promise<TreatmentPlan | null> {
    return getEntity(TreatmentPlan, { identifier: treatmentPlanId, identifierName: 'treatmentPlanId', relation });
}

export async function updateTreatmentPlan(update: { tens?: number; ultrasound?: number }, type: TreatmentPlan['type'], treatmentPlanId: string, author: string) {
    return await getConnection().transaction(async manager => {
        const plan = await manager.findOne(TreatmentPlan, { where: { treatmentPlanId }, relations: ['treatmentPlanHistory'] });
        if (!plan) {
            logger.error(`[updateTreatmentPlan]: treatment plan not found`);
            throw new Error(`[updateTreatmentPlan]: treatment plan not found`);
        }
        if (plan.type !== type) {
            logger.error(`[updateTreatmentPlan]: treatment plan type mismatch`);
            throw new Error(`[updateTreatmentPlan]: treatment plan type mismatch`);
        }
        if (!plan.treatmentPlanHistory) {
            logger.error(`[updateTreatmentPlan]: treatment plan history not found`);
            throw new Error(`[updateTreatmentPlan]: treatment plan history not found`);
        }
        logger.info(`[updateTreatmentPlan]: updating treatment plan ${treatmentPlanId} by author ${author} with update ${JSON.stringify(update)}`);
        const history = await manager.save(
            manager.create(TreatmentPlanHistory, {
                detail: {
                    tens: plan.tens,
                    ultrasound: plan.ultrasound,
                },
                author,
                version: plan.version,
            }),
        );
        plan.treatmentPlanHistory.push(history);
        return await manager.save(Object.assign(plan, update));
    });
}

// create a treatment plan
export async function createTreatmentPlan(name: string, group: string, type: TreatmentPlan['type'], setting: Partial<TreatmentPlan>) {
    return await getConnection().transaction(async manager => {
        // check if treatment plan already exists
        const plan = await manager.findOne(TreatmentPlan, { where: { name, group } });
        if (plan) {
            logger.error(`[createTreatmentPlan]: treatment plan already exists`);
            throw new Error(`[createTreatmentPlan]: treatment plan already exists`);
        }
        logger.info(`[createTreatmentPlan]: creating treatment plan ${name} for group ${group} with setting ${JSON.stringify(setting)}`);
        return await manager.save(
            manager.create(TreatmentPlan, {
                name,
                group,
                type,
                ...setting,
            }),
        );
    });
}
