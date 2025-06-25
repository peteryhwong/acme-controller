import { createHash } from 'crypto';

export function hash(value: string) {
    return createHash('sha256').update(value, 'utf8').digest('hex');
}
