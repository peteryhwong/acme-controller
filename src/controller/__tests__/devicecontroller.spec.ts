import { createHttpServer } from '@ankh/ankh-http/lib/httpserver';
import * as express from 'express';
import * as sinon from 'sinon';
import * as request from 'supertest';
import { serverSpec } from '../../component/config';
import { APPLICATION_NAME } from '../../component/constant';
import * as assignee from '../../component/repository/assignee';
import * as command from '../../component/repository/command';
import * as device from '../../component/repository/device';
import * as location from '../../component/repository/location';
import * as user from '../../component/repository/user';
import { Assignee } from '../../entity/assignee';
import { Device } from '../../entity/device';
import { Location } from '../../entity/location';
import { User } from '../../entity/user';
import { components } from '../../types/schema';
import { getTokenWithRoles } from './util';

describe('DeviceController', () => {
    const sandbox = sinon.createSandbox();
    let expressApp: express.Express;

    beforeAll(async () => {
        const { app } = await createHttpServer(serverSpec);
        expressApp = app;
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('create device', () => {
        it('should send back 201 if device is created', async () => {
            // Given
            const token = getTokenWithRoles(['platform_admin']);
            const getDeviceByCode = sandbox.stub(device, 'getDeviceByCode').resolves(null);
            const getLocationById = sandbox.stub(location, 'getLocationById').resolves({ locationId: '1af3ad9a-7329-4906-a98a-6da342b19a8d', group: 'ankh' } as unknown as Location);
            const createDevice = sandbox.stub(device, 'createDevice').resolves({ deviceId: 'b35ae1ad-001b-4ade-9368-bfd376c5ce01' } as unknown as Device);
            const createCommand = sandbox.stub(command, 'createCommand').resolves({ commandId: '903f06ea-0308-4cde-b00c-0333ae95bfcd' });
            const createAssignee = sandbox.stub(assignee, 'createAssignee').resolves({} as unknown as Assignee);
            const createUser = sandbox.stub(user, 'createUser').resolves({} as unknown as User);

            // When
            const requestBody: components['schemas']['DeviceRequest'] = {
                code: 'device001',
                type: 'acme001',
                locationId: '1af3ad9a-7329-4906-a98a-6da342b19a8d',
                password: '12345678',
            };
            const { status, body } = await request(expressApp).post(`/${APPLICATION_NAME}/v1.0/device`).auth(token, { type: 'bearer' }).send(requestBody);

            // Then
            expect({ status, body }).toEqual({
                status: 201,
                body: {
                    deviceId: 'b35ae1ad-001b-4ade-9368-bfd376c5ce01',
                },
            });
            expect(getDeviceByCode.calledOnce).toBe(true);
            expect(getDeviceByCode.args).toEqual([['device001', 'ankh']]);
            expect(getLocationById.calledOnce).toBe(true);
            expect(getLocationById.args).toEqual([['1af3ad9a-7329-4906-a98a-6da342b19a8d']]);
            expect(createDevice.calledOnce).toBe(true);
            expect(createDevice.args).toEqual([
                [
                    {
                        deviceCode: 'device001',
                        deviceType: 'acme001',
                        passCode: '12345678',
                        location: { locationId: '1af3ad9a-7329-4906-a98a-6da342b19a8d', group: 'ankh' },
                    },
                ],
            ]);
            expect(createCommand.calledOnce).toBe(true);
            expect(createCommand.args).toEqual([
                [
                    {
                        deviceId: 'b35ae1ad-001b-4ade-9368-bfd376c5ce01',
                    },
                    {
                        command: 'ping',
                    },
                ],
            ]);
            expect(createAssignee.calledOnce).toBe(true);
            expect(createUser.calledOnce).toBe(true);
        });
    });
});
