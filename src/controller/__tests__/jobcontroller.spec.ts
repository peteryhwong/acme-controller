import { createHttpServer } from '@ankh/ankh-http/lib/httpserver';
import * as express from 'express';
import * as sinon from 'sinon';
import * as request from 'supertest';
import { proTreatment } from '../../component/__tests__/mock/treatment';
import { serverSpec } from '../../component/config';
import { APPLICATION_NAME } from '../../component/constant';
import * as job from '../../component/job';
import { components, operations } from '../../types/schema';
import { getTokenWithRoles } from './util';

describe('JobController', () => {
    const sandbox = sinon.createSandbox();
    let expressApp: express.Express;

    beforeAll(async () => {
        const { app } = await createHttpServer(serverSpec);
        expressApp = app;
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('create job', () => {
        it('should return 201', async () => {
            // Given
            const preset = proTreatment.plan.preset;
            if (!preset) {
                throw new Error('preset is undefined');
            }
            const token = getTokenWithRoles(['platform_user']);
            const response: operations['createJob']['responses']['201']['content']['application/json'] = {
                jobId: '47913794-dacf-4604-bd96-b26ceeba42de',
                assigneeId: 'c1f984b6-5872-4bb0-9ecd-04f645eadc06',
                userId: '6676788e-a6bb-4591-abd4-9b94634a99ea',
                deviceId: '7321e611-83c9-4fca-8255-824fa10522bc',
                status: 'pending',
                treatmentPlan: {
                    type: 'pronew',
                    detail: {
                        plan: {
                            preset,
                        },
                        ultrasoundSetting: {
                            scheme: {
                                oneMContinuous: true,
                                oneMPulse: true,
                                threeMContinuous: true,
                                threeMPulse: true,
                            },
                            intensityLimit: {
                                oneMC: 10,
                                threeMC: 10,
                                oneMP: 10,
                                threeMP: 10,
                            },
                            pulseDutyRatio: {
                                oneM: 0,
                                threeM: 0,
                            },
                            pulseFrequencyInHz: {
                                oneM: 1,
                                threeM: 1,
                            },
                            temperatureThreshold: 0,
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
                    },
                },
            };
            const createJob = sandbox.stub(job, 'createJob').resolves(response);

            // When
            const requestBody: components['schemas']['BaseJobWithAssignee'] = {
                assigneeId: 'c1f984b6-5872-4bb0-9ecd-04f645eadc06',
                userId: '6676788e-a6bb-4591-abd4-9b94634a99ea',
                treatmentPlan: {
                    type: 'pronew',
                    detail: {
                        plan: {
                            preset,
                        },
                        ultrasoundSetting: {
                            scheme: {
                                oneMContinuous: true,
                                oneMPulse: true,
                                threeMContinuous: true,
                                threeMPulse: true,
                            },
                            intensityLimit: {
                                oneMC: 10,
                                threeMC: 10,
                                oneMP: 10,
                                threeMP: 10,
                            },
                            pulseDutyRatio: {
                                oneM: 0,
                                threeM: 0,
                            },
                            pulseFrequencyInHz: {
                                oneM: 1,
                                threeM: 1,
                            },
                            temperatureThreshold: 0,
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
                    },
                },
            };
            const { status, body } = await request(expressApp)
                .post(`/${APPLICATION_NAME}/v1.0/device/7321e611-83c9-4fca-8255-824fa10522bc/job`)
                .set('Authorization', `Bearer ${token}`)
                .send(requestBody);

            // Then
            expect({ status, body }).toEqual({
                status: 201,
                body: response,
            });
            expect(createJob.calledOnce).toBeTruthy();
            expect(createJob.args).toEqual([['7321e611-83c9-4fca-8255-824fa10522bc', requestBody]]);
        });
    });
});
