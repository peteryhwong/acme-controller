import { Command } from '../entity/command';
import { Job } from '../entity/job';
import { JobDifference } from '../types/job';
import { components } from '../types/schema';
import { logger } from './logger';

export const TRAINING_TREATMENT_PLANS = ['pronew008'];

export const ULTRASOUND_TEMPERATURE_THRESHOLD_UPPERBOUND_MAP: Record<components['schemas']['UltrasoundSetting']['temperatureThreshold'], number> = {
    0: 45,
    1: 47,
    2: 49,
};

export const ULTRASOUND_SCHEME_CHANNEL_MAP: Record<keyof components['schemas']['UltrasoundSetting']['scheme'], keyof components['schemas']['UltrasoundSetting']['intensityLimit']> = {
    oneMContinuous: 'oneMC',
    threeMContinuous: 'threeMC',
    oneMPulse: 'oneMP',
    threeMPulse: 'threeMP',
};

export function isUsingSelected(selection: Record<string, boolean | object>, selected: string) {
    return Object.entries(selection)
        .filter(([_, val]) => typeof val === 'object' || (typeof val === 'boolean' && val === true))
        .map(([key]) => key)
        .includes(selected);
}

export function getUltrasoundPlannedDurationInSeconds(report: components['schemas']['ProNewPlanSnapshot']) {
    return report.plan.ultrasound * 60;
}

export function getUltrasoundActualRemainingInSeconds(ultrasound: Pick<components['schemas']['UltrasoundSnapshot'], 'time'>) {
    if (!ultrasound.time) {
        throw new Error('ultrasound.time not found');
    }
    const multiple = ultrasound.time.timeRemain.unit === 'minute' ? 60 : 1;
    return ultrasound.time.timeRemain.value * multiple;
}

export function getTensPlannedDurationInSeconds(report: components['schemas']['ProNewPlanSnapshot']) {
    return report.plan.tens * 60;
}

export function getTensActualRemainingInSeconds(tens: Pick<components['schemas']['TensSnapshot'], 'time'>) {
    if (!tens.time) {
        throw new Error('tens.time not found');
    }
    const multiple = tens.time.timeRemain.unit === 'minute' ? 60 : 1;
    return tens.time.timeRemain.value * multiple;
}

export function getPulseChannel(scheme: components['schemas']['UltrasoundSnapshot']['scheme']): keyof components['schemas']['UltrasoundSetting']['pulseDutyRatio'] | undefined {
    switch (scheme) {
        case 'oneMPulse':
            return 'oneM';
        case 'threeMPulse':
            return 'threeM';
        case 'oneMContinuous':
        case 'threeMContinuous':
            return;
        default:
            throw new Error('Unknown scheme');
    }
}

export function diffUltrasound(ultrasoundSpec: components['schemas']['UltrasoundSetting'], ultrasound: components['schemas']['UltrasoundSnapshot']): JobDifference[] {
    const jobDifferences: JobDifference[] = [];
    if (!isUsingSelected(ultrasoundSpec.scheme, ultrasound.scheme)) {
        jobDifferences.push({
            type: 'ultrasound.scheme',
            expect: ultrasoundSpec.scheme,
            actual: ultrasound.scheme,
        });
    }
    const channel = ULTRASOUND_SCHEME_CHANNEL_MAP[ultrasound.scheme];
    if (ultrasoundSpec.intensityLimit[channel] < ultrasound.intensity) {
        jobDifferences.push({
            type: 'ultrasound.intensity',
            expect: ultrasoundSpec.intensityLimit[channel],
            actual: ultrasound.intensity,
        });
    }
    const pulseChannel = getPulseChannel(ultrasound.scheme);
    if (pulseChannel) {
        if (ultrasoundSpec.pulseDutyRatio[pulseChannel] !== ultrasound.pulseDutyRatio) {
            jobDifferences.push({
                type: 'ultrasound.pulseDutyRatio',
                expect: ultrasoundSpec.pulseDutyRatio[pulseChannel],
                actual: ultrasound.pulseDutyRatio,
            });
        }
        if (ultrasoundSpec.pulseFrequencyInHz[pulseChannel] !== ultrasound.pulseFrequencyInHz) {
            jobDifferences.push({
                type: 'ultrasound.pulseFrequencyInHz',
                expect: ultrasoundSpec.pulseFrequencyInHz[pulseChannel],
                actual: ultrasound.pulseFrequencyInHz,
            });
        }
    }
    if (ULTRASOUND_TEMPERATURE_THRESHOLD_UPPERBOUND_MAP[ultrasoundSpec.temperatureThreshold] < ultrasound.temperature) {
        jobDifferences.push({
            type: 'ultrasound.temperature',
            expect: ULTRASOUND_TEMPERATURE_THRESHOLD_UPPERBOUND_MAP[ultrasoundSpec.temperatureThreshold],
            actual: ultrasound.temperature,
        });
    }
    return jobDifferences;
}

export function diffTens(tensSpec: components['schemas']['TensSetting'], tens: components['schemas']['TensSnapshot']): JobDifference[] {
    const jobDifferences: JobDifference[] = [];
    let channel: keyof typeof tensSpec.channel;
    for (channel in tensSpec.channel) {
        if (!tensSpec.channel[channel] && tens.intensity[channel] > 0) {
            jobDifferences.push({
                type: `tens.channel.${channel}`,
                expect: 'false',
                actual: 'true',
            });
        }
        if (tensSpec.intensitylimit[channel] < tens.intensity[channel]) {
            jobDifferences.push({
                type: `tens.intensity.${channel}`,
                expect: tensSpec.intensitylimit[channel],
                actual: tens.intensity[channel],
            });
        }
    }
    if (!isUsingSelected(tensSpec.waveform, tens.waveform)) {
        jobDifferences.push({
            type: 'tens.waveform',
            expect: tensSpec.waveform,
            actual: tens.waveform,
        });
    }
    let heatChannel: keyof typeof tensSpec.heatLimit;
    for (heatChannel in tensSpec.heatLimit) {
        if (tensSpec.heatLimit[heatChannel] < tens.temperature[heatChannel]) {
            jobDifferences.push({
                type: `tens.temperature.${heatChannel}`,
                expect: tensSpec.heatLimit[heatChannel],
                actual: tens.temperature[heatChannel],
            });
        }
    }
    return jobDifferences;
}

export function isProNewTreatmentPlanValid(name: string, plan: components['schemas']['ProNewTreatmentPlanWithVersion']['plan']): boolean {
    return (TRAINING_TREATMENT_PLANS.includes(name) || plan.ultrasound >= 5) && plan.tens >= 0 && plan.ultrasound >= 0 && 0 < plan.tens + plan.ultrasound && plan.tens + plan.ultrasound <= 30;
}

export function diffPlan(planSpec: components['schemas']['ProNewPlanSetting'], plan: components['schemas']['ProNewPlanSnapshot']): JobDifference[] {
    const jobDifferences: JobDifference[] = [];
    const selectedPlan = planSpec.preset[plan.name];
    if (!selectedPlan.enabled) {
        jobDifferences.push({
            type: 'treatment.plan',
            expect: selectedPlan,
            actual: plan,
        });
        return jobDifferences;
    }
    if (selectedPlan.customizable) {
        logger.warn(`[diffPlan]: ${plan.name} is customizable, skip checking`);
        return jobDifferences;
    }
    if (selectedPlan.plan.tens !== plan.plan.tens || selectedPlan.plan.ultrasound !== plan.plan.ultrasound) {
        jobDifferences.push({
            type: 'treatment.plan',
            expect: selectedPlan,
            actual: plan,
        });
        return jobDifferences;
    }
    return jobDifferences;
}

export function checkTensDuration(report: Exclude<components['schemas']['ProNewPlanSnapshot'], 'ultrasound30Tens0'>, tens: Pick<components['schemas']['TensSnapshot'], 'time'>): JobDifference[] {
    const jobDifferences: JobDifference[] = [];
    const duration = getTensPlannedDurationInSeconds(report);
    const remaining = getTensActualRemainingInSeconds(tens);
    if (remaining > duration) {
        jobDifferences.push({
            type: 'tens.duration',
            expect: duration,
            actual: remaining,
        });
    }
    return jobDifferences;
}

export function checkUltrasoundDuration(
    report: Exclude<components['schemas']['ProNewPlanSnapshot'], 'ultrasound0Tens30'>,
    ultrasound: Pick<components['schemas']['UltrasoundSnapshot'], 'time'>,
): JobDifference[] {
    const jobDifferences: JobDifference[] = [];
    const duration = getUltrasoundPlannedDurationInSeconds(report);
    const remaining = getUltrasoundActualRemainingInSeconds(ultrasound);
    if (remaining > duration) {
        jobDifferences.push({
            type: 'ultrasound.duration',
            expect: duration,
            actual: remaining,
        });
    }
    return jobDifferences;
}

export function isProNewPlanSetting(plan: components['schemas']['ProSetting']['plan']): plan is components['schemas']['ProNewPlanSetting'] {
    return !!plan.preset;
}

export function isUltrasoundRunning(reportPlan: components['schemas']['ProNewPlanSnapshot'], ultrasound: Pick<components['schemas']['ProSnapshot']['ultrasoundSnapshot'], 'time'>): boolean {
    return reportPlan.plan.ultrasound > 0 && !!ultrasound.time;
}

export function isTensRunning(reportPlan: components['schemas']['ProNewPlanSnapshot'], tens: Pick<components['schemas']['ProSnapshot']['tensSnapshot'], 'time'>): boolean {
    return reportPlan.plan.tens > 0 && !!tens.time;
}

export function checkProJob(setting: components['schemas']['ProSetting'], report: components['schemas']['ProSnapshot']): JobDifference[] {
    const jobDifferences: JobDifference[] = [];
    const reportPlan = report.plan;
    const plan = setting.plan;
    if (!isProNewPlanSetting(plan) || typeof reportPlan === 'string') {
        jobDifferences.push({
            type: 'treatment.plan',
            expect: setting.plan,
            actual: reportPlan,
        });
        return jobDifferences;
    }
    jobDifferences.push(...diffPlan(plan, reportPlan));
    if (isTensRunning(reportPlan, report.tensSnapshot)) {
        jobDifferences.push(...checkTensDuration(reportPlan, report.tensSnapshot));
        jobDifferences.push(...diffTens(setting.tensSetting, report.tensSnapshot));
    }
    if (isUltrasoundRunning(reportPlan, report.ultrasoundSnapshot)) {
        jobDifferences.push(...checkUltrasoundDuration(reportPlan, report.ultrasoundSnapshot));
        jobDifferences.push(...diffUltrasound(setting.ultrasoundSetting, report.ultrasoundSnapshot));
    }
    return jobDifferences;
}

export function checkJobType(jobType: Job['detail']['treatmentPlan']['type'], reportType: components['schemas']['JobHistory']['detail']['treatment']['type']) {
    switch (jobType) {
        case 'pro':
        case 'pronew':
            return ['pro', 'pronew'].includes(reportType);
        default:
            logger.error(`[checkJobType]: unknown treatment type ${jobType}`);
            throw new Error(`[checkJobType]: unknown treatment type ${jobType}`);
    }
}

export function checkJob(job: Pick<Job, 'detail' | 'status'>, report: Omit<components['schemas']['JobHistory'], 'jobId'>): JobDifference[] {
    const { treatmentPlan } = job.detail;
    const { treatment } = report.detail;
    if (!checkJobType(treatmentPlan.type, treatment.type)) {
        return [
            {
                type: 'treatment.type',
                expect: treatmentPlan.type,
                actual: treatment.type,
            },
        ];
    }
    switch (treatmentPlan.type) {
        case 'pro':
        case 'pronew':
            return checkProJob(treatmentPlan.detail, treatment.detail);
        default:
            logger.error(`[checkJob]: unknown treatment type ${treatmentPlan.type}`);
            throw new Error(`[checkJob]: unknown treatment type ${treatmentPlan.type}`);
    }
}

export function isPendingUpdateAction(command: Pick<Command, 'detail' | 'status'>): boolean {
    return 'action' in command.detail && command.detail.action === 'update' && command.status === 'pending';
}

export async function checkJobStatus(job: Pick<Job, 'jobId' | 'status' | 'command'>, report: components['schemas']['JobHistory']): Promise<boolean> {
    if (job.status === report.detail.status) {
        return true;
    }
    // check if there are a pending command to change status
    if (!job.command) {
        logger.error(`[checkJobStatus]: job ${job.jobId} has no command`);
        throw new Error(`[checkJobStatus]: job ${job.jobId} has no command`);
    }
    const pendingUpdateActions = job.command.filter(isPendingUpdateAction);
    if (pendingUpdateActions.length === 0) {
        return false;
    }
    return true;
}
