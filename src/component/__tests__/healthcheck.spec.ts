import { timeDifferenceInMinutes, isLongPendingPing } from '../healthcheck';

describe('@timeDifferenceInMinutes', () => {
    it('should return the difference in minutes', () => {
        const date1 = new Date('2021-01-01T00:00:00.000Z');
        const date2 = new Date('2021-01-01T00:01:00.000Z');
        expect(timeDifferenceInMinutes(date1, date2)).toBe(-1);
    });
});

// test isLongPendingPing
describe('@isLongPendingPing', () => {
    it('is long pending ping', () => {
        expect(
            isLongPendingPing({
                datetime: new Date('2021-01-01'),
                detail: {
                    command: 'ping',
                },
                status: 'pending',
            }),
        ).toBeTruthy();
    });
    it('is not long pending ping', () => {
        expect(
            isLongPendingPing({
                datetime: new Date('2021-01-01'),
                detail: {
                    command: 'ping',
                },
                status: 'acknowledged',
            }),
        ).toBeFalsy();
    });
    it('is not long pending ping', () => {
        expect(
            isLongPendingPing({
                datetime: new Date(),
                detail: {
                    command: 'ping',
                },
                status: 'pending',
            }),
        ).toBeFalsy();
    });
});
