import { ObjectMeta, RequestOptions } from 'ali-oss';
import { URL } from 'url';
import { API, INTEGRATION, OSS } from '../constant';
import { getHKTISODateString } from '../date';
import { logger } from '../logger';

const TWO_MINUTES_IN_MS = 2 * 60 * 1000;
const TWO_HOURS_IN_SECONDS = 2 * 60 * 60;

const DEFAULT_REQUEST_OPTION: RequestOptions = {
    timeout: TWO_MINUTES_IN_MS,
};

type Bucket = keyof typeof OSS.bucket;

function getOSSClient(bucket: Bucket) {
    const config = OSS.bucket[bucket];
    // Jest complains when import * as OSS from 'ali-oss', so we use require instead
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    const OSSClient = require('ali-oss');
    return new OSSClient({
        region: config.region,
        accessKeyId: config.accessKeyId,
        accessKeySecret: config.accessKeySecret,
        bucket: config.bucket,
        secure: true,
    });
}

async function generatePresignedUrl(bucket: Bucket, object: string) {
    logger.info(`[generatePresignedUrl] ${bucket} ${object}`);
    const presignedUrl = await getOSSClient(bucket).asyncSignatureUrl(object, { expires: TWO_HOURS_IN_SECONDS });
    logger.info(`[generatePresignedUrl] ${presignedUrl}`);
    const url = new URL(presignedUrl);
    url.hostname = API.oss.bucket[bucket].domain ?? url.hostname;
    return url.toString();
}

// export for testing
export function filterAndExtractVersions<X extends Pick<ObjectMeta, 'name'>>(prefix: string, objects: X[]): X[] {
    const results: X[] = [];
    for (const object of objects) {
        logger.info(`[filterAndExtractVersions] ${object.name}`);
        const nameWithoutPrefix = object.name.replace(prefix, '');
        const regex = nameWithoutPrefix.match(/^\/([^\/]+)\/$/);
        if (regex === null) {
            continue;
        }
        results.push({
            ...object,
            name: regex[1],
        });
    }
    return results;
}

export async function listObjectDetails(bucket: Bucket, prefix = 'masterprogram/version') {
    logger.info(`[listObjectDetails] ${bucket} ${prefix}`);
    const result = await getOSSClient(bucket).listV2({ prefix }, DEFAULT_REQUEST_OPTION);
    logger.info(`[listObjectDetails] ${result.objects.length}`);
    return result.objects;
}

export async function listObjectNames(bucket: Bucket, prefix = 'masterprogram/version') {
    logger.info(`[listObjectNames] ${bucket} ${prefix}`);
    return filterAndExtractVersions<ObjectMeta>(prefix, await listObjectDetails(bucket, prefix)).map(object => ({
        name: object.name,
        lastModified: getHKTISODateString(object.lastModified),
    }));
}

const oss = {
    generatePresignedUrl,
    listObjectNames,
    listObjectDetails,
};

const mockOss: typeof oss = {
    generatePresignedUrl: async (_bucket, object) => `http://mock/${object}`,
    listObjectNames: async (_bucket, _prefix) => [
        {
            name: 'v1.2.0',
            lastModified: '2021-01-01T00:00:00.000Z',
        },
        {
            name: 'v1.2.1',
            lastModified: '2021-01-01T00:00:00.000Z',
        },
    ],
    listObjectDetails: async (_bucket, _prefix) => [
        {
            name: 'masterprogram/version/v1.2.0/',
            url: 'https://mock/masterprogram/version/v1.2.0/',
            lastModified: '2025-05-12T07:31:45.000Z',
            etag: '"D41D8CD98F00B204E9800998ECF8427E"',
            type: 'Normal',
            size: 0,
            storageClass: 'Standard',
        },
        {
            name: 'masterprogram/version/v1.2.1/',
            url: 'https://mock/masterprogram/version/v1.2.1/',
            lastModified: '2025-05-12T07:31:45.000Z',
            etag: '"D41D8CD98F00B204E9800998ECF8427E"',
            type: 'Normal',
            size: 0,
            storageClass: 'Standard',
        },
    ],
};

export default INTEGRATION === 'real' ? oss : mockOss;
