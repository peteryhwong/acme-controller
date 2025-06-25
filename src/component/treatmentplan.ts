import { TreatmentPlan } from '../entity/treatmentplan';
import { components } from '../types/schema';
import { isProNewTreatmentPlanValid } from './check';
import { DEFAULT_PRONEW_TREATMENT_PLAN } from './constant';
import { logger } from './logger';
import { createTreatmentPlan, updateTreatmentPlan as updateTreatmentPlanToDb } from './repository/treatmentplan';

export async function updateTreatmentPlan(treatmentPlanId: string, treatmentPlanName: string, author: string, treatmentPlan: components['schemas']['TreatmentPlanUpdate']) {
    switch (treatmentPlan.type) {
        case 'pronew':
            if (!isProNewTreatmentPlanValid(treatmentPlanName, treatmentPlan.plan)) {
                logger.error(`[updateTreatmentPlan]: invalid treatment plan`);
                throw new Error(`[updateTreatmentPlan]: invalid treatment plan`);
            }
            return await updateTreatmentPlanToDb(treatmentPlan.plan, treatmentPlan.type, treatmentPlanId, author);
        default:
            throw new Error(`[updateTreatmentPlan]: unknown treatment plan type ${treatmentPlan.type}`);
    }
}

export async function loadTreatmentPlans(planMap: Record<string, TreatmentPlan>, plan: components['schemas']['ProSetting']['plan']) {
    if (!plan.preset) {
        logger.info(`[loadTreatmentPlans]: no treatment plan preset`);
        return plan;
    }
    if (plan.preset.pronew001.plan) {
        logger.info(`[loadTreatmentPlans]: treatment plan preset already loaded`);
        return plan;
    }
    let treatmentName: keyof typeof plan.preset;
    for (treatmentName in plan.preset) {
        const treatmentPlan = planMap[treatmentName];
        if (!treatmentPlan) {
            logger.error(`[loadTreatmentPlans]: treatment plan ${treatmentName} not found`);
            throw new Error(`[loadTreatmentPlans]: treatment plan ${treatmentName} not found`);
        }
        plan.preset[treatmentName].type = treatmentPlan.type;
        plan.preset[treatmentName].version = treatmentPlan.version.toString();
        plan.preset[treatmentName].plan = {
            tens: treatmentPlan.tens,
            ultrasound: treatmentPlan.ultrasound,
        };
    }
    return plan;
}

// create treatment plans of particular type for a group
export async function createTreatmentPlansForGroup(group: string, treatmentPlan: components['schemas']['TreatmentPlanCreateRequest']) {
    switch (treatmentPlan.type) {
        case 'pronew': {
            const defaultplan: components['schemas']['CustomizableProNewTreatmentPlanWithVersion'] = {
                type: 'pronew',
                customizable: false,
                enabled: true,
                plan: DEFAULT_PRONEW_TREATMENT_PLAN,
                version: '1',
            };
            const preset: components['schemas']['ProNewPlanSetting']['preset'] = {
                pronew001: defaultplan,
                pronew002: defaultplan,
                pronew003: defaultplan,
                pronew004: defaultplan,
                pronew005: defaultplan,
                pronew006: defaultplan,
                pronew007: defaultplan,
                pronew008: defaultplan,
            };
            const plans: TreatmentPlan[] = [];
            for (const [name, plan] of Object.entries(preset)) {
                logger.info(`[createTreatmentPlansForGroup]: create treatment plan ${name} for group ${group}`);
                plans.push(await createTreatmentPlan(name, group, plan.type, { ...plan.plan }));
            }
            return plans;
        }
        default:
            throw new Error(`[createTreatmentPlansForGroup]: unknown treatment plan type ${treatmentPlan.type}`);
    }
}
