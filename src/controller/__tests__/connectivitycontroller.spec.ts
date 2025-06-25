import { createHttpServer } from '@ankh/ankh-http/lib/httpserver';
import * as express from 'express';
import * as sinon from 'sinon';
import * as request from 'supertest';
import { serverSpec } from '../../component/config';
import { APPLICATION_NAME } from '../../component/constant';
import { hash } from '../../component/hash';
import * as assignee from '../../component/repository/assignee';
import * as device from '../../component/repository/device';
import * as event from '../../component/repository/event';
import { Assignee } from '../../entity/assignee';
import { Device } from '../../entity/device';
import { components } from '../../types/schema';

describe('ConnectivityController', () => {
    const sandbox = sinon.createSandbox();
    let expressApp: express.Express;

    beforeAll(async () => {
        const { app } = await createHttpServer(serverSpec);
        expressApp = app;
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('authentication', () => {
        it('should send back 401 if assignee is not valid', async () => {
            // Given
            const passHash = hash('12345678');
            const deviceHash = hash('device00112345678');
            const location = { locationId: '08cbe4db-4ef1-4f4e-98a6-14552824cfa9', name: 'tst', group: 'ankh' };
            const getDeviceByCode = sandbox
                .stub(device, 'getDeviceByCode')
                .resolves({ location, code: 'device001', hash: deviceHash, deviceId: 'e9404018-8f22-492f-b6ec-2029c42cbc39' } as unknown as Device);
            const getDevice = sandbox.stub(device, 'getDevice').resolves({ location, code: 'device001', hash: deviceHash, deviceId: 'e9404018-8f22-492f-b6ec-2029c42cbc39' } as unknown as Device);
            const getAssigneeByUsername = sandbox.stub(assignee, 'getAssigneeByUsername').resolves({ hash: passHash, username: 'username', location } as unknown as Assignee);

            // When
            const { status, body } = await request(expressApp)
                .post(`/${APPLICATION_NAME}/v1.0/authentication`)
                .auth('device001@ankh', '12345678', { type: 'basic' })
                .send({ username: 'username', password: '12345678', type: 'user' });

            // Then
            expect({ status, body }).toEqual({
                status: 200,
                body: {
                    code: 200,
                    message: 'Authentication successful',
                    object: {
                        valid: true,
                        type: 'user',
                        role: 'device_user',
                    },
                },
            });

            expect(getDeviceByCode.calledOnce).toBe(true);
            expect(getDeviceByCode.args).toEqual([['device001', 'ankh']]);
            expect(getDevice.calledOnce).toBe(true);
            expect(getDevice.args).toEqual([[{ deviceId: 'e9404018-8f22-492f-b6ec-2029c42cbc39', relation: ['location'] }]]);
            expect(getAssigneeByUsername.calledOnce).toBe(true);
            expect(getAssigneeByUsername.args).toEqual([[{ username: 'username', relation: ['location'] }]]);
        });
    });

    describe('create report', () => {
        it('should send back 201 if report is created', async () => {
            // Given
            const deviceHash = hash('device00112345678');
            const location = { locationId: '08cbe4db-4ef1-4f4e-98a6-14552824cfa9', name: 'tst', group: 'ankh' };
            const getDeviceByCode = sandbox
                .stub(device, 'getDeviceByCode')
                .resolves({ location, code: 'device001', hash: deviceHash, deviceId: 'e9404018-8f22-492f-b6ec-2029c42cbc39' } as unknown as Device);
            const getDevice = sandbox.stub(device, 'getDevice').resolves({ code: 'device001', hash: deviceHash, deviceId: 'e9404018-8f22-492f-b6ec-2029c42cbc39' } as unknown as Device);
            const createDeviceEventInDb = sandbox.stub(event, 'createDeviceEventInDb').resolves({ eventId: 'b35ae1ad-001b-4ade-9368-bfd376c5ce01' });
            const startedAt = new Date();

            // When
            const requestBody: components['schemas']['DeviceReport'] = {
                detail: [
                    {
                        type: 'error',
                        jobId: 'jobId',
                        detail: {
                            error: 'ultrasoundOverheat',
                            startedAt,
                        },
                    },
                ],
            };
            const { status, body } = await request(expressApp).post(`/${APPLICATION_NAME}/v1.0/report`).auth('device001@ankh', '12345678', { type: 'basic' }).send(requestBody);

            // Then
            expect({ status, body }).toEqual({
                status: 201,
                body: {
                    code: 201,
                    message: 'Report created',
                    object: {
                        reportId: 'b35ae1ad-001b-4ade-9368-bfd376c5ce01',
                    },
                },
            });
            expect(getDeviceByCode.calledOnce).toBe(true);
            expect(getDeviceByCode.args).toEqual([['device001', 'ankh']]);
            expect(getDevice.calledOnce).toBe(true);
            expect(getDevice.args).toEqual([[{ deviceId: 'e9404018-8f22-492f-b6ec-2029c42cbc39' }]]);
            expect(createDeviceEventInDb.calledOnce).toBe(true);
            expect(createDeviceEventInDb.args).toEqual([
                [
                    {
                        code: 'device001',
                        deviceId: 'e9404018-8f22-492f-b6ec-2029c42cbc39',
                        hash: deviceHash,
                    },
                    [
                        {
                            ...requestBody.detail[0],
                            detail: {
                                ...requestBody.detail[0].detail,
                                startedAt: startedAt.toISOString(),
                            },
                        },
                    ],
                ],
            ]);
        });
    });
});
