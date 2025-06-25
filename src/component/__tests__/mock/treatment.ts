import { components } from '../../../types/schema';

export const plan: components['schemas']['ProNewPlanSetting'] = {
    preset: {
        pronew001: {
            type: 'pronew',
            plan: {
                tens: 10,
                ultrasound: 20,
            },
            version: '2',
            customizable: false,
            enabled: true,
        },
        pronew002: {
            type: 'pronew',
            plan: {
                tens: 10,
                ultrasound: 20,
            },
            version: '2',
            customizable: false,
            enabled: true,
        },
        pronew003: {
            type: 'pronew',
            plan: {
                tens: 20,
                ultrasound: 10,
            },
            version: '2',
            customizable: false,
            enabled: true,
        },
        pronew004: {
            type: 'pronew',
            plan: {
                tens: 10,
                ultrasound: 20,
            },
            version: '2',
            customizable: false,
            enabled: true,
        },
        pronew005: {
            type: 'pronew',
            plan: {
                tens: 10,
                ultrasound: 20,
            },
            version: '2',
            customizable: false,
            enabled: true,
        },
        pronew006: {
            type: 'pronew',
            plan: {
                tens: 0,
                ultrasound: 20,
            },
            version: '2',
            customizable: false,
            enabled: true,
        },
        pronew007: {
            type: 'pronew',
            plan: {
                tens: 10,
                ultrasound: 20,
            },
            version: '2',
            customizable: false,
            enabled: true,
        },
        pronew008: {
            type: 'pronew',
            plan: {
                tens: 10,
                ultrasound: 20,
            },
            version: '2',
            customizable: false,
            enabled: true,
        },
    },
};

export const proTreatment: components['schemas']['ProSetting'] = {
    plan,
    tensSetting: {
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
            ch1: 0,
            ch2: 0,
            ch3: 0,
            ch4: 0,
        },
        heatLimit: {
            ch1: 0,
            ch2: 0,
        },
    },
    ultrasoundSetting: {
        scheme: {
            oneMContinuous: true,
            threeMContinuous: true,
            oneMPulse: true,
            threeMPulse: true,
        },
        intensityLimit: {
            oneMC: 0,
            threeMC: 0,
            oneMP: 0,
            threeMP: 0,
        },
        pulseDutyRatio: {
            oneM: 0,
            threeM: 0,
        },
        pulseFrequencyInHz: {
            oneM: 1,
            threeM: 1,
        },
        temperatureThreshold: 2,
    },
};
