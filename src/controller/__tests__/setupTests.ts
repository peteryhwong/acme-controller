import { beforeEach } from '@jest/globals';
import * as nock from 'nock';

import { API } from '../../component/constant';
import { getPublicKey, getTokenWithRoles } from './util';

beforeEach(() => {
    nock(API.user.baseUrl).persist().post('/v1.0/token').reply(200, {
        token: getTokenWithRoles(),
    });

    nock(API.user.baseUrl)
        .persist()
        .get('/v1.0/key')
        .reply(200, {
            key: Buffer.from(getPublicKey()).toString('base64'),
        });
});

afterEach(() => {
    nock.cleanAll();
});
