import { ServerSpec } from '@ankh/ankh-http/lib/type';
import { path as connectivityPaths } from '../openapi/paths/connectivity';

export function isConnectivityEndpoint(err: { path?: string }) {
    const { path } = err;
    if (!path) {
        return false;
    }
    return Object.keys(connectivityPaths).some(connectivityPath => path.endsWith(connectivityPath));
}

export function getErrorMessage(body: { error_message?: string | { msg: string | undefined } }) {
    return typeof body?.error_message === 'object' && 'msg' in body.error_message ? body.error_message.msg ?? 'Unknown error' : body?.error_message ?? 'Unknown error';
}

export const errorformat: NonNullable<ServerSpec['errorformat']> = (err, body) => {
    if (isConnectivityEndpoint(err)) {
        return {
            object: null,
            code: body.error_code,
            message: getErrorMessage(body),
        };
    }
    return body;
};
