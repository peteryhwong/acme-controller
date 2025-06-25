import { createHttpServer } from '@ankh/ankh-http/lib/httpserver';
import * as express from 'express';
import * as sinon from 'sinon';
import * as request from 'supertest';
import { serverSpec } from '../../component/config';
import { APPLICATION_NAME } from '../../component/constant';
import { getLocalDate } from '../../component/date';
import * as location from '../../component/repository/location';
import * as user from '../../component/repository/user';
import { Location } from '../../entity/location';
import { User } from '../../entity/user';
import { components } from '../../types/schema';
import { getTokenWithRoles } from './util';

describe('UserController', () => {
    const sandbox = sinon.createSandbox();
    let expressApp: express.Express;

    beforeAll(async () => {
        const { app } = await createHttpServer(serverSpec);
        expressApp = app;
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('create user', () => {
        it('should send back 201 if user is created', async () => {
            // Given
            const datetime = new Date();
            const token = getTokenWithRoles(['platform_admin']);
            const getUserByUsernumber = sandbox.stub(user, 'getUserByUsernumber').resolves(null);
            const getLocationById = sandbox.stub(location, 'getLocationById').resolves({ locationId: '1af3ad9a-7329-4906-a98a-6da342b19a8d', group: 'ankh' } as unknown as Location);
            const createUser = sandbox.stub(user, 'createUser').resolves({ userId: 'b35ae1ad-001b-4ade-9368-bfd376c5ce01', datetime } as unknown as User);

            // When
            const requestBody: components['schemas']['BaseUser'] = {
                name: 'john',
                userNumber: 'ankh1234',
                locationId: '1af3ad9a-7329-4906-a98a-6da342b19a8d',
            };
            const { status, body } = await request(expressApp).post(`/${APPLICATION_NAME}/v1.0/user`).auth(token, { type: 'bearer' }).send(requestBody);

            // Then
            expect({ status, body }).toEqual({
                status: 201,
                body: {
                    userId: 'b35ae1ad-001b-4ade-9368-bfd376c5ce01',
                    createdAt: getLocalDate(datetime).toISOString() as unknown as Date,
                    job: [],
                    locationId: '1af3ad9a-7329-4906-a98a-6da342b19a8d',
                    name: 'john',
                    userNumber: 'ankh1234',
                } as components['schemas']['User'],
            });
            expect(getUserByUsernumber.calledOnce).toBe(true);
            expect(getLocationById.calledOnce).toBe(true);
            expect(getLocationById.args).toEqual([['1af3ad9a-7329-4906-a98a-6da342b19a8d']]);
            expect(createUser.calledOnce).toBe(true);
        });
    });
});
