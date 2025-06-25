import { getConnection } from '@ankh/ankh-db/lib/connection';
import { getEntitiesBy, getEntityBy, QuerySpec, toRelationSpec, WhereSpec } from '@ankh/ankh-db/lib/util';
import { Location } from '../../entity/location';
import { User } from '../../entity/user';
import { logger } from '../logger';

export function toQuerySpec(request: { includeDeleted?: boolean; userId?: string[]; userNumber?: string[]; relation?: string[]; groups?: string[] }): QuerySpec {
    const { groups, userNumber, userId, relation: rawRelation, includeDeleted } = request;
    const relation = rawRelation ?? [];
    const relations = relation.map(toRelationSpec);
    const ids: WhereSpec[] = [];
    if (groups) {
        ids.push({
            identifierName: 'group',
            identifier: groups,
            entity: 'location',
        });
        if (!relation.includes('location')) {
            relations.push({
                inner: true,
                name: 'location',
            });
        }
    }
    if (userId) {
        ids.push({
            identifierName: 'userId',
            identifier: userId,
        });
    }
    if (userNumber) {
        ids.push({
            identifierName: 'userNumber',
            identifier: userNumber,
        });
    }
    return {
        ids,
        relations,
        includeDeleted,
    };
}

export async function createUser(user: { name: string; userNumber: string; location: Location; type?: 'internal' | 'external' }): Promise<Pick<User, 'userId' | 'userNumber' | 'name' | 'datetime'>> {
    const { userNumber, name, location, type = 'external' } = user;
    return getConnection().transaction(async manager => {
        logger.info(`[createUser] create user ${userNumber}...`);
        const user = await manager.save(
            manager.create(User, {
                location,
                userNumber,
                name,
                type,
            }),
        );
        logger.info(`[createUser] created user ${userNumber}, userId: ${user.userId}`);
        return user;
    });
}

export async function getUsers(req: { includeDeleted?: boolean; relation?: string[]; groups?: string[] }) {
    const { includeDeleted = false, relation, groups } = req;
    return getEntitiesBy(User, toQuerySpec({ groups, includeDeleted, relation }));
}

export async function getUserByUsernumber(req: { userNumber: string; groups?: string[]; relation?: string[] }) {
    const { userNumber, groups, relation } = req;
    return getEntityBy(User, toQuerySpec({ groups, userNumber: [userNumber], relation }));
}

export async function getUserById(req: { userId: string; groups?: string[]; relation?: string[] }) {
    const { userId, groups, relation } = req;
    return getEntityBy(User, toQuerySpec({ userId: [userId], groups, relation }));
}

export function updateUser(userId: string, update: Partial<User>) {
    return getConnection().transaction(async manager => {
        const user = await manager.findOneBy(User, { userId });
        if (!user) {
            logger.error(`[updateUser] user ${userId} not found`);
            throw new Error(`[updateUser] user ${userId} not found`);
        }
        if (update.location) {
            user.location = update.location;
        }
        user.deletedAt = update.deletedAt ?? user.deletedAt;
        return manager.save(user);
    });
}
