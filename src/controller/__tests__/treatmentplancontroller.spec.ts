import { createHttpServer } from '@ankh/ankh-http/lib/httpserver';
import * as express from 'express';
import * as sinon from 'sinon';
import * as request from 'supertest';
import { serverSpec } from '../../component/config';
import { APPLICATION_NAME } from '../../component/constant';
import * as treatmentplan from '../../component/repository/treatmentplan';
import { TreatmentPlan } from '../../entity/treatmentplan';
import { components } from '../../types/schema';
import { getTokenWithRoles } from './util';

describe('TreatmentPlanController', () => {
    const sandbox = sinon.createSandbox();
    let expressApp: express.Express;

    beforeAll(async () => {
        const { app } = await createHttpServer(serverSpec);
        expressApp = app;
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('update treatment plan', () => {
        it('should send back 200 if treamtment plan is updated', async () => {
            // Given
            const token = getTokenWithRoles(['platform_admin']);
            const getTreatmentPlanById = sandbox.stub(treatmentplan, 'getTreatmentPlanById').resolves({
                treatmentPlanId: 'e8da4bee-e63e-4bb0-810e-16f679d812d0',
                version: 1,
                tens: 10,
                ultrasound: 10,
                datetime: new Date(),
                group: 'ankh',
                type: 'pronew',
                name: 'pronew008',
            } as TreatmentPlan);
            const updateTreatmentPlan = sandbox.stub(treatmentplan, 'updateTreatmentPlan').resolves({
                treatmentPlanId: 'e8da4bee-e63e-4bb0-810e-16f679d812d0',
                version: 2,
                tens: 10,
                ultrasound: 0,
                datetime: new Date(),
                group: 'ankh',
                type: 'pronew',
                name: 'pronew008',
            } as TreatmentPlan);

            // When
            const requestBody: components['schemas']['TreatmentPlanUpdate'] = {
                plan: {
                    tens: 10,
                    ultrasound: 0,
                },
                type: 'pronew',
            };
            const { status } = await request(expressApp).put(`/${APPLICATION_NAME}/v1.0/treatmentplan/e8da4bee-e63e-4bb0-810e-16f679d812d0`).auth(token, { type: 'bearer' }).send(requestBody);

            // Then
            expect({ status }).toEqual({
                status: 200,
            });
            expect(getTreatmentPlanById.calledOnce).toBe(true);
            expect(updateTreatmentPlan.calledOnce).toBe(true);
        });
    });
});
