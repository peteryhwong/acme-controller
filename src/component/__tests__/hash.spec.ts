import { hash } from '../hash';

describe('@hash', () => {
    it('should hash to the same string', () => {
        expect(hash('123456')).toBe('8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92');
    });
});
