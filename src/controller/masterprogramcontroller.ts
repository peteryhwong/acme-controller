import { Request, Response } from 'express';
import { getDateStringForResponse } from '../component/date';
import oss from '../component/integration/oss';
import { logger } from '../component/logger';
import { components, operations } from '../types/schema';

export async function getMasterPrograms(
    _request: Request<any, any, any, any>,
    response: Response<operations['getMasterPrograms']['responses']['200']['content']['application/json'] | components['schemas']['Error']>,
) {
    try {
        logger.info(`[getMasterPrograms] get master programs`);
        const masterPrograms = await oss.listObjectNames('acme-repository');
        logger.info(`[getMasterPrograms] found ${masterPrograms.length} master programs`);
        response.status(200).json({
            masterprogram: masterPrograms.map(({ lastModified, name }) => ({
                datetime: getDateStringForResponse(lastModified),
                version: name,
            })),
        });
    } catch (error) {
        logger.error(`[getMasterPrograms] error: ${error}`);
        response.status(500).json({ error_code: '500', error_message: 'Internal Server Error' });
        return;
    }
}
