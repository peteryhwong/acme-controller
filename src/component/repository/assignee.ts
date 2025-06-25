import { getConnection } from '@ankh/ankh-db/lib/connection';
import { getEntitiesBy, getEntityBy, QuerySpec, toRelationSpec, WhereSpec } from '@ankh/ankh-db/lib/util';
import { Assignee } from '../../entity/assignee';
import { Location } from '../../entity/location';
import { hash } from '../hash';
import { logger } from '../logger';

export async function createAssignee(assignee: {
    username: string;
    passcode: string;
    role: Assignee['role'];
    location: Location;
    keepcasing?: boolean;
    type?: 'internal' | 'external';
}): Promise<Pick<Assignee, 'assigneeId' | 'username' | 'role'>> {
    const { username, passcode, location, role, keepcasing, type = 'external' } = assignee;
    return getConnection().transaction(async manager => {
        logger.info(`[createAssignee] create assignee ${username}...`);
        const assignee = await manager.save(
            manager.create(Assignee, {
                location,
                username: keepcasing ? username : username.toLowerCase(),
                hash: hash(passcode),
                role,
                type,
            }),
        );
        logger.info(`[createAssignee] created assignee ${username}, assigneeId: ${assignee.assigneeId}`);
        return assignee;
    });
}

export async function updateAssignee(assigneeId: string, assigneeUpdate: Partial<Assignee> & { password?: string }): Promise<void> {
    const { deletedAt, password, location } = assigneeUpdate;
    return getConnection().transaction(async manager => {
        logger.info(`[updateAssignee] update assignee ${assigneeId}...`);
        const assignee = await manager.findOneBy(Assignee, { assigneeId });
        if (!assignee) {
            throw new Error(`[updateAssignee] assignee ${assigneeId} not found`);
        }
        assignee.deletedAt = deletedAt ?? assignee.deletedAt;
        if (location) {
            assignee.location = location;
        }
        if (password) {
            assignee.hash = hash(password);
        }
        await manager.save(assignee);
        logger.info(`[updateAssignee] updated assignee ${assigneeId}`);
    });
}

export function toQuerySpec(request: { groups?: string[]; username?: string; assigneeId?: string; includeDeleted?: boolean; relation?: string[] }): QuerySpec {
    const { groups, username, assigneeId, relation: rawRelation, includeDeleted } = request;
    const relation = rawRelation ?? [];
    const relations = relation.map(toRelationSpec);
    const ids: WhereSpec[] = [];
    if (username) {
        ids.push({
            identifierName: 'username',
            identifier: [username],
        });
    }
    if (assigneeId) {
        ids.push({
            identifierName: 'assigneeId',
            identifier: [assigneeId],
        });
    }
    if (groups) {
        if (!relation.includes('location')) {
            relations.push({
                inner: true,
                name: 'location',
            });
        }
        ids.push({
            identifierName: 'group',
            identifier: groups,
            entity: 'location',
        });
    }
    return {
        ids,
        relations,
        includeDeleted,
    };
}

export async function getAssignees(req: { groups?: string[]; includeDeleted?: boolean; relation?: string[] }) {
    const { groups, includeDeleted = false, relation = [] } = req;
    return getEntitiesBy(Assignee, toQuerySpec({ groups, relation, includeDeleted }));
}

export async function getAssigneeByUsername(req: { groups?: string[]; username: string; relation?: string[] }) {
    const { groups, username, relation = [] } = req;
    return getEntityBy(Assignee, toQuerySpec({ groups, username: username.toLowerCase(), relation }));
}

export async function getAssigneeById(req: { groups?: string[]; assigneeId: string; relation?: string[] }) {
    const { groups, assigneeId, relation = [] } = req;
    return getEntityBy(Assignee, toQuerySpec({ groups, assigneeId, relation }));
}
