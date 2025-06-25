import { getTokenWithRoles } from './functions/jwt';
import { createLocation, deleteLocation } from './functions/location';

describe(`Location`, () => {
    it('Add and delete an location', async () => {
        const jwtToken = getTokenWithRoles(['platform_admin']);
        console.log(`Got token ${jwtToken}`);

        const locationName = Math.random().toString(36).substring(2, 8);
        console.log(`Creating location ${locationName}`);
        const tbd = await createLocation(jwtToken, locationName);
        console.log(`Created location ${tbd}`);

        console.log(`Deleting location tbd`);
        await deleteLocation(jwtToken, tbd);
        console.log(`Deleted location tbd`);
    });
});
