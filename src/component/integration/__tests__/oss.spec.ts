import { filterAndExtractVersions } from '../oss';

describe('oss', () => {
    it('should filter versions', () => {
        const versions = [{ name: 'masterprogram/version/' }, { name: 'masterprogram/version/v1.0.0/' }, { name: 'masterprogram/version/v1.0.0/masterprogram.apk' }];
        const filtered = filterAndExtractVersions('masterprogram/version', versions);
        expect(filtered).toEqual([{ name: 'v1.0.0' }]);
    });
});
