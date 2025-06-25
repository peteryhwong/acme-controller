import { DEFAULT_LOCATION, DEFAULT_LOCATION_2 } from './functions/constant';
import { getTokenWithRoles } from './functions/jwt';
import { getLocationId } from './functions/location';
import { createUser, deleteUser, updateUserLocation } from './functions/user';

describe(`User`, () => {
    it('Add and delete a user', async () => {
        const jwtToken = getTokenWithRoles(['platform_admin']);
        console.log(`Got token ${jwtToken}`);

        const userNumberSuffix = Math.random().toString(36).substring(2, 8);
        console.log(`Creating user john`);
        const userId = await createUser(jwtToken, 'John', `ANKH-${userNumberSuffix}`, await getLocationId(jwtToken, DEFAULT_LOCATION));
        console.log(`Created user ${userId}`);

        console.log(`Updating user john location`);
        await updateUserLocation(jwtToken, userId, await getLocationId(jwtToken, DEFAULT_LOCATION_2));
        console.log(`Updated user john location`);

        console.log(`Deleting user john`);
        await deleteUser(jwtToken, userId);
        console.log(`Deleted user john`);
    });
});
