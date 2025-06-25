import { createHttpServer } from '@ankh/ankh-http/lib/httpserver';
import * as express from 'express';
import * as sinon from 'sinon';
import * as request from 'supertest';
import { serverSpec } from '../../component/config';
import { APPLICATION_NAME } from '../../component/constant';
import * as command from '../../component/repository/command';
import * as device from '../../component/repository/device';
import { components } from '../../types/schema';
import { getTokenWithRoles } from './util';
import { Device } from '../../entity/device';

describe('CommandController', () => {
    const sandbox = sinon.createSandbox();
    let expressApp: express.Express;

    beforeAll(async () => {
        const { app } = await createHttpServer(serverSpec);
        expressApp = app;
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('create command', () => {
        it('should send back 201 if command is created', async () => {
            // Given
            const token = getTokenWithRoles(['platform_admin']);
            const getDevice = sandbox.stub(device, 'getDevice').resolves({ deviceId: 'e9404018-8f22-492f-b6ec-2029c42cbc39' } as unknown as Device);
            const createCommand = sandbox.stub(command, 'createCommand').resolves({ commandId: 'b35ae1ad-001b-4ade-9368-bfd376c5ce01' });

            // When
            const requestBody: components['schemas']['BaseCommand'] = {
                command: {
                    command: 'ping',
                },
            };
            const { status, body } = await request(expressApp).post(`/${APPLICATION_NAME}/v1.0/device/e9404018-8f22-492f-b6ec-2029c42cbc39/command`).auth(token, { type: 'bearer' }).send(requestBody);

            // Then
            expect({ status, body }).toEqual({
                status: 201,
                body: {
                    commandId: 'b35ae1ad-001b-4ade-9368-bfd376c5ce01',
                },
            });
            expect(getDevice.calledOnce).toBe(true);
            expect(getDevice.args).toEqual([[{ deviceId: 'e9404018-8f22-492f-b6ec-2029c42cbc39', groups: ['ankh'] }]]);
            expect(createCommand.calledOnce).toBe(true);
            expect(createCommand.args.length).toBe(1);
            expect(createCommand.args[0][0].deviceId).toEqual('e9404018-8f22-492f-b6ec-2029c42cbc39');
            expect(createCommand.args[0][1]).toEqual({
                command: 'ping',
            });
        });
    });
});
