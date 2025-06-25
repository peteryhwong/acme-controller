import { createHttpServer } from '@ankh/ankh-http/lib/httpserver';
import * as express from 'express';
import * as sinon from 'sinon';
import * as request from 'supertest';
import { serverSpec } from '../../component/config';
import { APPLICATION_NAME } from '../../component/constant';
import * as location from '../../component/repository/location';
import { components } from '../../types/schema';
import { getTokenWithRoles } from './util';

describe('LocationController', () => {
    const sandbox = sinon.createSandbox();
    let expressApp: express.Express;

    beforeAll(async () => {
        const { app } = await createHttpServer(serverSpec);
        expressApp = app;
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('create location', () => {
        it('should send back 201 if location is created', async () => {
            // Given
            const token = getTokenWithRoles(['platform_admin']);
            const findLocationByName = sandbox.stub(location, 'findLocationByName').resolves(null);
            const createLocation = sandbox.stub(location, 'createLocation').resolves({ locationId: 'b35ae1ad-001b-4ade-9368-bfd376c5ce01', device: [] });

            // When
            const requestBody: components['schemas']['BaseLocation'] = {
                name: 'location1',
                group: 'ankh',
            };
            const { status, body } = await request(expressApp).post(`/${APPLICATION_NAME}/v1.0/location`).auth(token, { type: 'bearer' }).send(requestBody);

            // Then
            expect({ status, body }).toEqual({
                status: 201,
                body: {
                    locationId: 'b35ae1ad-001b-4ade-9368-bfd376c5ce01',
                    name: 'location1',
                    group: 'ankh',
                    device: [],
                },
            });
            expect(findLocationByName.calledOnce).toBe(true);
            expect(findLocationByName.args).toEqual([['location1', 'ankh']]);
            expect(createLocation.calledOnce).toBe(true);
            expect(createLocation.args).toEqual([['location1', 'ankh']]);
        });
        it('should send back 400 if location already exists', async () => {
            // Given
            const token = getTokenWithRoles(['platform_admin']);
            const findLocationByName = sandbox.stub(location, 'findLocationByName').resolves({ locationId: 'b35ae1ad-001b-4ade-9368-bfd376c5ce01' } as any);

            // When
            const requestBody: components['schemas']['BaseLocation'] = {
                name: 'location1',
                group: 'ankh',
            };
            const { status, body } = await request(expressApp).post(`/${APPLICATION_NAME}/v1.0/location`).auth(token, { type: 'bearer' }).send(requestBody);

            // Then
            expect({ status, body }).toEqual({
                status: 400,
                body: {
                    error_code: '400',
                    error_message: 'Location already exists',
                },
            });
            expect(findLocationByName.calledOnce).toBe(true);
            expect(findLocationByName.args).toEqual([['location1', 'ankh']]);
        });
    });
});
