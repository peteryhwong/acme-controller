import { mockServerClient } from 'mockserver-client';
import { DEFAULT_LOCATION, DEFAULT_LOCATION_2 } from './functions/constant';
import { getPublicKey, getTokenWithRoles } from './functions/jwt';
import { createLocation } from './functions/location';
import { getAllTreatmentPlans } from './functions/treatmentplan';

require('ts-node/register');

module.exports = async (): Promise<void> => {
    const key = Buffer.from(getPublicKey()).toString('base64');
    console.log(`Mock to return public key ${key}`);
    await mockServerClient('mock', 1080).mockAnyResponse({
        httpRequest: {
            method: 'GET',
            path: '/user/v1.0/key',
        },
        httpResponse: {
            statusCode: 200,
            headers: [
                {
                    name: 'Content-Type',
                    values: ['application/json'],
                },
            ],
            body: JSON.stringify({
                key,
            }),
        },
    });

    const jwtToken = getTokenWithRoles(['platform_admin']);
    console.log(`Got token ${jwtToken}`);

    const locationId = await createLocation(jwtToken, DEFAULT_LOCATION, false);
    console.log(`Created location ${locationId}`);

    // create location 2
    const locationId2 = await createLocation(jwtToken, DEFAULT_LOCATION_2, false);
    console.log(`Created location ${locationId2}`);

    const plans = await getAllTreatmentPlans(jwtToken);
    console.log(`Got ${plans.length} treatment plans`);
    if (plans.length !== 8) {
        throw new Error(`Expected 8 treatment plans, got ${plans.length}`);
    }
};
