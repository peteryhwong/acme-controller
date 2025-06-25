import * as client from './client';

export const DEFAULT_REDUCED_TREATMENT_PLAN_PLAN: client.ProNewTreatmentPlanSetting = {
    preset: {
        pronew001: {
            customizable: false,
            enabled: true,
        },
        pronew002: {
            customizable: false,
            enabled: true,
        },
        pronew003: {
            customizable: false,
            enabled: true,
        },
        pronew004: {
            customizable: false,
            enabled: true,
        },
        pronew005: {
            customizable: false,
            enabled: true,
        },
        pronew006: {
            customizable: false,
            enabled: true,
        },
        pronew007: {
            customizable: false,
            enabled: true,
        },
        pronew008: {
            customizable: false,
            enabled: true,
        },
    },
};

export const DEFAULT_TREATMENT_PLAN: client.BaseJob['treatmentPlan'] = {
    type: 'pronew',
    detail: {
        plan: DEFAULT_REDUCED_TREATMENT_PLAN_PLAN,
        ultrasoundSetting: {
            scheme: {
                oneMContinuous: true,
                oneMPulse: true,
                threeMContinuous: true,
                threeMPulse: true,
            },
            intensityLimit: {
                oneMC: 20,
                threeMC: 15,
                oneMP: 20,
                threeMP: 15,
            },
            pulseDutyRatio: {
                oneM: 3,
                threeM: 3,
            },
            pulseFrequencyInHz: {
                oneM: 2,
                threeM: 2,
            },
            temperatureThreshold: 2,
        },
        tensSetting: {
            waveform: {
                wf1: true,
                wf2: true,
                wf3: true,
                wf4: true,
                wf5: true,
                wf6: true,
            },
            channel: {
                ch1: true,
                ch2: true,
                ch3: true,
                ch4: true,
            },
            intensitylimit: {
                ch1: 30,
                ch2: 30,
                ch3: 30,
                ch4: 30,
            },
            heatLimit: {
                ch1: 2,
                ch2: 2,
            },
        },
    },
};

export function createTreatmentSnapshot(treatmentPlan: client.BaseJob['treatmentPlan'] = DEFAULT_TREATMENT_PLAN): client.TreatmentSnapshot {
    const snapshot: client.TreatmentSnapshot = {
        type: treatmentPlan.type,
        detail: {
            plan: {
                plan: {
                    tens: 10,
                    ultrasound: 20,
                },
                name: 'pronew001',
            },
            ultrasoundSnapshot: {
                pulseFrequencyInHz: 1,
                pulseDutyRatio: 0,
                temperature: treatmentPlan.detail.ultrasoundSetting.temperatureThreshold,
                scheme: 'oneMContinuous',
                intensity: 10,
                time: {
                    startedAt: new Date().toISOString(),
                    timeRemain: {
                        unit: 'minute',
                        value: 10,
                    },
                },
            },
            tensSnapshot: {
                intensity: {
                    ch1: treatmentPlan.detail.tensSetting.intensitylimit.ch1,
                    ch2: treatmentPlan.detail.tensSetting.intensitylimit.ch2,
                    ch3: treatmentPlan.detail.tensSetting.intensitylimit.ch3,
                    ch4: treatmentPlan.detail.tensSetting.intensitylimit.ch4,
                },
                temperature: {
                    ch1: 0,
                    ch2: 0,
                },
                waveform: 'wf1',
                time: {
                    startedAt: new Date().toISOString(),
                    timeRemain: {
                        unit: 'minute',
                        value: 10,
                    },
                },
            },
        },
    };
    console.log(`Created treatment snapshot ${JSON.stringify(snapshot)}`);
    return snapshot;
}
