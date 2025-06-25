import { components } from '../types/schema';
import { logger } from './logger';

function base64(string: string) {
    return Buffer.from(string, 'utf-8').toString('base64');
}

export function deviceLocalAdminAssigneeUsername(deviceId: string): string {
    return base64(`${deviceId}_local_assignee_device_admin_${deviceId}`).replace(/=+$/, '');
}

export function deviceLocalUser(deviceId: string): string {
    return base64(`${deviceId}_local_user_${deviceId}`).replace(/=+$/, '');
}

export function globalOfflineJobId(deviceId: string, offlineJobId: string): string {
    return `${deviceId}_offline_job_${offlineJobId}`;
}

const DEFAULT_DISABLED_PRONEW_PRESET: components['schemas']['CustomizableProNewTreatmentPlanWithVersion'] = {
    customizable: false,
    enabled: false,
    plan: {
        tens: 0,
        ultrasound: 5,
    },
    type: 'pronew',
    version: '0',
};

const DISABLED_PRONEW_PLAN_PRESET: components['schemas']['ProNewPlanSetting']['preset'] = {
    pronew001: DEFAULT_DISABLED_PRONEW_PRESET,
    pronew002: DEFAULT_DISABLED_PRONEW_PRESET,
    pronew003: DEFAULT_DISABLED_PRONEW_PRESET,
    pronew004: DEFAULT_DISABLED_PRONEW_PRESET,
    pronew005: DEFAULT_DISABLED_PRONEW_PRESET,
    pronew006: DEFAULT_DISABLED_PRONEW_PRESET,
    pronew007: DEFAULT_DISABLED_PRONEW_PRESET,
    pronew008: DEFAULT_DISABLED_PRONEW_PRESET,
};

const MAX_TENS_SETTING: components['schemas']['TensSetting'] = {
    channel: {
        ch1: true,
        ch2: true,
        ch3: true,
        ch4: true,
    },
    waveform: {
        wf1: true,
        wf2: true,
        wf3: true,
        wf4: true,
        wf5: true,
        wf6: true,
    },
    intensitylimit: {
        ch1: 50,
        ch2: 50,
        ch3: 50,
        ch4: 50,
    },
    heatLimit: {
        ch1: 2,
        ch2: 2,
    },
};

const MAX_ULTRASOUND_SETTING: components['schemas']['UltrasoundSetting'] = {
    intensityLimit: {
        oneMC: 20,
        oneMP: 20,
        threeMC: 15,
        threeMP: 15,
    },
    pulseDutyRatio: {
        oneM: 3,
        threeM: 3,
    },
    pulseFrequencyInHz: {
        oneM: 3,
        threeM: 3,
    },
    scheme: {
        oneMContinuous: true,
        oneMPulse: true,
        threeMContinuous: true,
        threeMPulse: true,
    },
    temperatureThreshold: 2,
};

function getPulseRatio(ultrasoundSnapshot: components['schemas']['UltrasoundSnapshot']): components['schemas']['UltrasoundSetting']['pulseDutyRatio'] {
    switch (ultrasoundSnapshot.scheme) {
        case 'oneMPulse':
            return {
                ...MAX_ULTRASOUND_SETTING.pulseDutyRatio,
                oneM: ultrasoundSnapshot.pulseDutyRatio,
            };
        case 'threeMPulse':
            return {
                ...MAX_ULTRASOUND_SETTING.pulseDutyRatio,
                threeM: ultrasoundSnapshot.pulseDutyRatio,
            };
        default:
            return MAX_ULTRASOUND_SETTING.pulseDutyRatio;
    }
}

function getPulseFrequencyInHz(
    ultrasoundSnapshot: Pick<components['schemas']['UltrasoundSnapshot'], 'scheme' | 'pulseDutyRatio' | 'pulseFrequencyInHz'>,
): components['schemas']['UltrasoundSetting']['pulseFrequencyInHz'] {
    switch (ultrasoundSnapshot.scheme) {
        case 'oneMPulse':
            return {
                ...MAX_ULTRASOUND_SETTING.pulseFrequencyInHz,
                oneM: ultrasoundSnapshot.pulseFrequencyInHz,
            };
        case 'threeMPulse':
            return {
                ...MAX_ULTRASOUND_SETTING.pulseFrequencyInHz,
                threeM: ultrasoundSnapshot.pulseFrequencyInHz,
            };
        default:
            return MAX_ULTRASOUND_SETTING.pulseFrequencyInHz;
    }
}

export function toPronewTreatmentPlanForOfflineJob(report: components['schemas']['JobHistory']): components['schemas']['BaseJob']['treatmentPlan'] {
    const treatment = report.detail.treatment;
    const plan = treatment.detail.plan;
    const ultrasoundSnapshot = treatment.detail.ultrasoundSnapshot;
    if (typeof plan === 'string') {
        logger.error(`[toPronewTreatmentPlanForOfflineJob] plan ${plan} is not supported`);
        throw new Error(`[toPronewTreatmentPlanForOfflineJob] plan ${plan} is not supported`);
    }
    return {
        type: treatment.type,
        detail: {
            plan: {
                preset: {
                    ...DISABLED_PRONEW_PLAN_PRESET,
                    [plan.name]: {
                        ...DISABLED_PRONEW_PLAN_PRESET[plan.name],
                        customizable: true,
                        enabled: true,
                    },
                },
            },
            tensSetting: MAX_TENS_SETTING,
            ultrasoundSetting: {
                ...MAX_ULTRASOUND_SETTING,
                pulseDutyRatio: getPulseRatio(ultrasoundSnapshot),
                pulseFrequencyInHz: getPulseFrequencyInHz(ultrasoundSnapshot),
            },
        },
    };
}

export function toTreatmentPlanForOfflineJob(report: components['schemas']['JobHistory']): components['schemas']['BaseJob']['treatmentPlan'] {
    switch (report.detail.treatment.type) {
        case 'pro':
        case 'pronew':
            return toPronewTreatmentPlanForOfflineJob(report);
        default:
            throw new Error(`Unknown treatment type: ${report.detail.treatment.type}`);
    }
}
