import { changePassword, createAssignee, deleteAssignee, updateAssigneeLocation } from './functions/assignee';
import { DEFAULT_LOCATION, DEFAULT_LOCATION_2 } from './functions/constant';
import { getTokenWithRoles } from './functions/jwt';
import { getLocationId } from './functions/location';

describe(`Assignee`, () => {
    it('Add and delete an assignee', async () => {
        const jwtToken = getTokenWithRoles(['platform_admin']);
        console.log(`Got token ${jwtToken}`);

        const assigneeUsername = Math.random().toString(36).substring(2, 8);
        console.log(`Creating assignee ${assigneeUsername}`);
        const assigneeId = await createAssignee(jwtToken, assigneeUsername, await getLocationId(jwtToken, DEFAULT_LOCATION), '12345678');
        console.log(`Created assignee ${assigneeId}`);

        // update assignee location
        console.log(`Updating assignee ${assigneeUsername} location`);
        await updateAssigneeLocation(jwtToken, assigneeId, await getLocationId(jwtToken, DEFAULT_LOCATION_2));
        console.log(`Updated assignee ${assigneeUsername} location`);

        // change password
        console.log(`Changing password of assignee ${assigneeUsername}`);
        const res = await changePassword(jwtToken, assigneeId, '123456789');
        expect(res.assigneeId).toEqual(assigneeId);

        console.log(`Deleting assignee ${assigneeUsername}`);
        await deleteAssignee(jwtToken, assigneeId);
        console.log(`Deleted assignee ${assigneeUsername}`);
    });
});
