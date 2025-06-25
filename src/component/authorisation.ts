import { authentication } from '@ankh/ankh-auth/lib/authentication';
import { Authentication, Payload as BasePayload, HttpAuthenticationConfig, PublicKey, Verifier } from '@ankh/ankh-auth/lib/type';
import { createVerifier } from '@ankh/ankh-auth/lib/verifier';

import { get as getter } from '@ankh/ankh-auth/lib/cache';
import { API, USER_BASE_URL } from './constant';
import { logger } from './logger';

export interface Payload extends BasePayload {
    metadata: {
        [key: string]: string;
    };
}

const config: HttpAuthenticationConfig = {
    baseUrl: USER_BASE_URL,
    loginPath: '/v1.0/token',
    getPublicKeyPath: '/v1.0/key',
};

export function getAuthentication(): Authentication {
    return authentication(config, logger);
}

export function getVerifier(): Verifier {
    return createVerifier(getAuthentication(), 'user', logger);
}

export async function getKey(): Promise<PublicKey> {
    return getter('PUBLIC_KEY', () => getAuthentication().getPublicKey());
}

export async function getTTL(token: string, key = getKey): Promise<number> {
    const payload = await getVerifier().verifyToken(token, key);
    return (payload.exp - new Date().getTime() / 1000) * 1000;
}

export async function getRobotToken(): Promise<string> {
    return getter('ROBOT_TOKEN', () => getAuthentication().login(API.robot), getTTL);
}
