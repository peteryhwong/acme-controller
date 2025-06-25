import { components } from '../../../types/schema';

export const report: components['schemas']['JobHistory'] = {
    type: 'interim',
    jobId: '98fcdb80-78b9-4f7d-ac04-c9ff932cb148',
    detail: {
        status: 'play',
        treatment: {
            type: 'pronew',
            detail: {
                plan: {
                    name: 'pronew001',
                    plan: {
                        tens: 10,
                        ultrasound: 20,
                    },
                },
                tensSnapshot: {
                    time: {
                        startedAt: new Date('2025-04-25T07:14:23.107Z'),
                        timeRemain: {
                            unit: 'minute',
                            value: 10,
                        },
                    },
                    waveform: 'wf1',
                    intensity: {
                        ch1: 0,
                        ch2: 0,
                        ch3: 0,
                        ch4: 0,
                    },
                    temperature: {
                        ch1: 0,
                        ch2: 0,
                    },
                },
                ultrasoundSnapshot: {
                    time: {
                        startedAt: new Date('2025-04-25T07:14:23.107Z'),
                        timeRemain: {
                            unit: 'minute',
                            value: 10,
                        },
                    },
                    scheme: 'oneMContinuous',
                    intensity: 0,
                    temperature: 3,
                    pulseDutyRatio: 0,
                    pulseFrequencyInHz: 1,
                },
            },
        },
        assigneeUsername: 'peterwong',
    },
};
