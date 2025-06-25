import { Job } from '../../entity/job';
import { components } from '../../types/schema';
import { checkJob, isProNewTreatmentPlanValid } from '../check';
import { report } from './mock/report';
import { proTreatment } from './mock/treatment';

describe('isProNewTreatmentPlanValid', () => {
    it('should return true if treatment plan is valid', () => {
        expect(
            isProNewTreatmentPlanValid('pronew001', {
                ultrasound: 10,
                tens: 10,
            }),
        ).toBe(true);
    });
    it('should return false if treatment plan is not valid', () => {
        expect(
            isProNewTreatmentPlanValid('pronew001', {
                ultrasound: 10,
                tens: 100,
            }),
        ).toBe(false);
    });
    it('should return false if treatment plan is not valid', () => {
        expect(
            isProNewTreatmentPlanValid('pronew001', {
                ultrasound: 30,
                tens: 10,
            }),
        ).toBe(false);
    });
    it('should return false if treatment plan is not valid', () => {
        expect(
            isProNewTreatmentPlanValid('pronew001', {
                ultrasound: 2,
                tens: 10,
            }),
        ).toBe(false);
    });
    it('should return true if treatment plan is valid', () => {
        expect(
            isProNewTreatmentPlanValid('pronew008', {
                ultrasound: 2,
                tens: 10,
            }),
        ).toBe(true);
    });
});

describe('checkJob', () => {
    it('should return an empty array if job is valid', async () => {
        const job: Pick<Job, 'detail' | 'status'> = {
            detail: {
                treatmentPlan: {
                    type: 'pronew',
                    detail: proTreatment,
                },
            },
            status: 'play',
        };
        expect(checkJob(job, report)).toEqual([]);
    });
    it('should return job difference if ultrasound temperature is too hot', async () => {
        // Given
        const job: Pick<Job, 'detail' | 'status'> = {
            detail: {
                treatmentPlan: {
                    type: 'pronew',
                    detail: {
                        ...proTreatment,
                        ultrasoundSetting: {
                            ...proTreatment.ultrasoundSetting,
                            temperatureThreshold: 0,
                        },
                    },
                },
            },
            status: 'play',
        };
        const tooHot: components['schemas']['JobHistory'] = {
            ...report,
            detail: {
                ...report.detail,
                treatment: {
                    ...report.detail.treatment,
                    detail: {
                        ...report.detail.treatment.detail,
                        ultrasoundSnapshot: {
                            ...report.detail.treatment.detail.ultrasoundSnapshot,
                            temperature: 46,
                        },
                    },
                },
            },
        };
        // When
        const actual = checkJob(job, tooHot);
        // Then
        expect(actual).toEqual([
            {
                actual: 46,
                expect: 45,
                type: 'ultrasound.temperature',
            },
        ]);
    });
    it('should return job difference if ultrasound intensity is too high', () => {
        // Given
        const job: Pick<Job, 'detail' | 'status'> = {
            status: 'play',
            detail: {
                treatmentPlan: {
                    type: 'pronew',
                    detail: {
                        ...proTreatment,
                        ultrasoundSetting: {
                            ...proTreatment.ultrasoundSetting,
                            intensityLimit: {
                                ...proTreatment.ultrasoundSetting.intensityLimit,
                                oneMP: 1.0,
                            },
                        },
                    },
                },
            },
        };
        const tooHigh: components['schemas']['JobHistory'] = {
            ...report,
            detail: {
                ...report.detail,
                treatment: {
                    ...report.detail.treatment,
                    detail: {
                        ...report.detail.treatment.detail,
                        ultrasoundSnapshot: {
                            ...report.detail.treatment.detail.ultrasoundSnapshot,
                            scheme: 'oneMPulse',
                            intensity: 1.5,
                        },
                    },
                },
            },
        };
        // When
        const actual = checkJob(job, tooHigh);
        // Then
        expect(actual).toEqual([
            {
                actual: 1.5,
                expect: 1.0,
                type: 'ultrasound.intensity',
            },
        ]);
    });
    it('should return job difference incorrect treatment plan is selected', () => {
        // Given
        const preset = proTreatment.plan.preset;
        if (!preset) {
            throw new Error('preset is undefined');
        }
        const job: Pick<Job, 'detail' | 'status'> = {
            status: 'play',
            detail: {
                treatmentPlan: {
                    type: 'pronew',
                    detail: {
                        ...proTreatment,
                        plan: {
                            preset: {
                                ...preset,
                                pronew004: {
                                    plan: {
                                        tens: 0,
                                        ultrasound: 10,
                                    },
                                    type: 'pronew',
                                    version: '2',
                                    customizable: false,
                                    enabled: true,
                                },
                            },
                        },
                    },
                },
            },
        };
        const abnormal: components['schemas']['JobHistory'] = {
            ...report,
            detail: {
                ...report.detail,
                treatment: {
                    ...report.detail.treatment,
                    detail: {
                        ...report.detail.treatment.detail,
                        plan: {
                            name: 'pronew004',
                            plan: {
                                tens: 10,
                                ultrasound: 20,
                            },
                        },
                    },
                },
            },
        };
        // When
        const result = checkJob(job, abnormal);
        // Then
        expect(result).toEqual([
            {
                actual: {
                    name: 'pronew004',
                    plan: {
                        tens: 10,
                        ultrasound: 20,
                    },
                },
                expect: {
                    plan: {
                        tens: 0,
                        ultrasound: 10,
                    },
                    type: 'pronew',
                    version: '2',
                    customizable: false,
                    enabled: true,
                },
                type: 'treatment.plan',
            },
        ]);
    });
});
