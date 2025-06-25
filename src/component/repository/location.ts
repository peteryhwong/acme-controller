import { getConnection } from '@ankh/ankh-db/lib/connection';
import { getEntitiesBy, getEntity, getEntityBy, toRelationSpec, toWhereSpec, WhereSpec } from '@ankh/ankh-db/lib/util';
import { Device } from '../../entity/device';
import { Location } from '../../entity/location';
import { logger } from '../logger';

// find location by name from db
export function findLocationByName(name: string, group: string, relation: string[] = []) {
    return getEntityBy(Location, {
        ids: [toWhereSpec('name', name), toWhereSpec('group', group)],
        relations: relation.map(toRelationSpec),
    });
}

// get location by id from db
export function getLocationById(locationId: string, relation: string[] = []) {
    return getEntity(Location, { identifierName: 'locationId', identifier: locationId, relation });
}

// get all locations
export function getAllLocations(request: { groups?: string[]; name?: string[]; relation?: string[] }, includeDeleted = false) {
    const { name, relation, groups } = request;
    const relations = relation?.map(toRelationSpec) ?? [];
    const ids: WhereSpec[] = [];
    if (name) {
        ids.push({
            identifierName: 'name',
            identifier: name,
        });
    }
    if (Array.isArray(groups) && groups.length > 0) {
        ids.push({
            identifierName: 'group',
            identifier: groups,
        });
    }
    return getEntitiesBy(Location, {
        includeDeleted,
        ids,
        relations,
    });
}

export function createLocation(name: string, group: string): Promise<Pick<Location, 'locationId'> & { device: Pick<Device, 'deviceId'>[] | null }> {
    return getConnection().createEntityManager().save(Location, {
        name,
        group,
    });
}

export function updateLocation(locationId: string, update: { deletedAt?: Date }) {
    return getConnection().transaction(async manager => {
        const location = await manager.findOneBy(Location, { locationId });
        if (!location) {
            logger.error(`[updateLocation] location ${locationId} not found`);
            throw new Error(`[updateLocation] location ${locationId} not found`);
        }
        location.deletedAt = update.deletedAt ?? location.deletedAt;
        return manager.save(location);
    });
}
