import { Location } from '../entity/location';
import { DEFAULT_ASSIGNEE_ROLE } from './constant';
import { hash } from './hash';
import { logger } from './logger';
import { getAssigneeByUsername } from './repository/assignee';
import { getDeviceByCode } from './repository/device';

export async function authenticate(
    req: { username: string; password: string; type: 'device' | 'user' },
    location: Pick<Location, 'locationId' | 'name' | 'group'>,
): Promise<{ type: string; role: string } | false> {
    const { username, password, type } = req;
    logger.info(`[authenticate] validate ${type} ${username}...`);
    switch (type) {
        case 'device': {
            const device = await getDeviceByCode(username, location.group, ['location']);
            if (!device) {
                logger.info(`[authenticate] device ${username} not found`);
                return false;
            }
            if (hash(password) !== device.hash) {
                logger.info(`[authenticate] device ${username} authentication failed`);
                return false;
            }
            if (device.location.name !== location.name) {
                logger.info(`[authenticate] device ${username} location ${device.location.name} not match ${location.name}`);
                return false;
            }
            return { role: 'device', type };
        }
        case 'user': {
            const user = await getAssigneeByUsername({ username, relation: ['location'] });
            if (!user) {
                logger.info(`[authenticate] user ${username} not found`);
                return false;
            }
            if (hash(password) !== user.hash) {
                logger.info(`[authenticate] user ${username} authentication failed`);
                return false;
            }
            if (user.location.locationId !== location.locationId) {
                logger.info(`[authenticate] user ${username} location ${user.location.name} not match ${location.name}`);
                return false;
            }
            return { role: user.role ?? DEFAULT_ASSIGNEE_ROLE, type };
        }
        default:
            logger.info(`[authenticate] invalid type ${type}`);
            return false;
    }
}
