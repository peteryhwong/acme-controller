import { byDatetime } from '../sort';

// test byDatetime
describe('byDatetime', () => {
    it('should sort by datetime', () => {
        const a = { datetime: new Date(2020, 0, 1) };
        const b = { datetime: new Date(2020, 0, 2) };
        const c = { datetime: new Date(2020, 0, 3) };
        const d = { datetime: new Date(2020, 0, 4) };
        const e = { datetime: new Date(2020, 0, 5) };
        const f = { datetime: new Date(2020, 0, 6) };
        const g = { datetime: new Date(2020, 0, 7) };
        const h = { datetime: new Date(2020, 0, 8) };
        const i = { datetime: new Date(2020, 0, 9) };
        const j = { datetime: new Date(2020, 0, 10) };
        const k = { datetime: new Date(2020, 0, 11) };
        const l = { datetime: new Date(2020, 0, 12) };
        const m = { datetime: new Date(2020, 0, 13) };
        const n = { datetime: new Date(2020, 0, 14) };
        const o = { datetime: new Date(2020, 0, 15) };

        const array = [a, b, c, d, e, f, g, h, i, j, k, l, m, n, o];
        const sorted = array.sort(byDatetime).reverse();
        expect(sorted).toEqual([o, n, m, l, k, j, i, h, g, f, e, d, c, b, a]);
    });
});
