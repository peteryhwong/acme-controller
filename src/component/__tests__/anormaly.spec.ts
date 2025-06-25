import * as sinon from 'sinon';
import { JobHistory } from '../../entity/jobhistory';
import { hasUltrasoundOverheatAnormaly, hasUltrasoundTemperatureAnormaly } from '../anormaly';
import * as job from '../repository/job';
import { report } from './mock/report';

function getDateSecondsAgo(secondsAgo: number): Date {
    return new Date(Date.now() - secondsAgo * 1000);
}

function getHistoryWithTemperature(temperature: number, secondsAgo: number): Pick<JobHistory, 'datetime' | 'detail'> {
    return {
        datetime: getDateSecondsAgo(secondsAgo),
        detail: {
            treatment: {
                ...report.detail.treatment,
                detail: {
                    ...report.detail.treatment.detail,
                    ultrasoundSnapshot: {
                        ...report.detail.treatment.detail.ultrasoundSnapshot,
                        temperature,
                    },
                },
            },
        },
    };
}

function getOverHeatErrorHistory(secondsAgo: number): Pick<JobHistory, 'datetime' | 'detail'> {
    return {
        datetime: getDateSecondsAgo(secondsAgo),
        detail: {
            error: 'ultrasoundOverheat',
            startedAt: getDateSecondsAgo(secondsAgo + 100),
        },
    };
}

describe('hasUltrasoundOverheatAnormaly', () => {
    const sandbox = sinon.createSandbox();
    afterEach(() => {
        sandbox.restore();
    });

    it('should return false if job is not at play', async () => {
        await expect(
            hasUltrasoundOverheatAnormaly(
                {
                    jobId: '1',
                    status: 'frozen',
                },
                {
                    detail: {
                        error: 'ultrasoundOverheat',
                        startedAt: new Date(),
                        endedAt: new Date(),
                    },
                },
                100,
            ),
        ).resolves.toBeFalsy();
    });

    it('should return false if error is not overheat', async () => {
        await expect(
            hasUltrasoundOverheatAnormaly(
                {
                    jobId: '1',
                    status: 'play',
                },
                {
                    detail: {
                        error: 'tensCh4Shorted',
                        startedAt: new Date(),
                        endedAt: new Date(),
                    },
                },
                100,
            ),
        ).resolves.toBeFalsy();
    });

    it('should return false if error is not overheat', async () => {
        await expect(
            hasUltrasoundOverheatAnormaly(
                {
                    jobId: '1',
                    status: 'play',
                },
                {
                    detail: {
                        error: 'tensCh4Shorted',
                        startedAt: new Date(),
                        endedAt: new Date(),
                    },
                },
                100,
            ),
        ).resolves.toBeFalsy();
    });
    it('should return true if error has started before considered range', async () => {
        await expect(
            hasUltrasoundOverheatAnormaly(
                {
                    jobId: '1',
                    status: 'play',
                },
                {
                    detail: {
                        error: 'ultrasoundOverheat',
                        startedAt: getDateSecondsAgo(110),
                    },
                },
                100,
            ),
        ).resolves.toBeTruthy();
    });
    it('should return true if error has started before and ended longer than the considered range', async () => {
        await expect(
            hasUltrasoundOverheatAnormaly(
                {
                    jobId: '1',
                    status: 'play',
                },
                {
                    detail: {
                        error: 'ultrasoundOverheat',
                        startedAt: getDateSecondsAgo(210),
                        endedAt: getDateSecondsAgo(100),
                    },
                },
                100,
            ),
        ).resolves.toBeTruthy();
    });
    it('should return false if overheat error has appeared within the considered range', async () => {
        const mockHistory = [getOverHeatErrorHistory(80), getOverHeatErrorHistory(50), getOverHeatErrorHistory(30)];
        const getAscendingJobUltrasoundHistory = sandbox.stub(job, 'getAscendingJobUltrasoundHistory').resolves(mockHistory);
        await expect(
            hasUltrasoundOverheatAnormaly(
                {
                    jobId: '1',
                    status: 'play',
                },
                {
                    detail: {
                        error: 'ultrasoundOverheat',
                        startedAt: getDateSecondsAgo(50),
                    },
                },
                100,
            ),
        ).resolves.toBeFalsy();
        expect(getAscendingJobUltrasoundHistory.calledOnce).toBeTruthy();
    });
    it('should return true if overheat error has appeared over the considered range', async () => {
        const mockHistory = [getOverHeatErrorHistory(101), getOverHeatErrorHistory(80), getOverHeatErrorHistory(50), getOverHeatErrorHistory(30)];
        const getAscendingJobUltrasoundHistory = sandbox.stub(job, 'getAscendingJobUltrasoundHistory').resolves(mockHistory);
        await expect(
            hasUltrasoundOverheatAnormaly(
                {
                    jobId: '1',
                    status: 'play',
                },
                {
                    detail: {
                        error: 'ultrasoundOverheat',
                        startedAt: getDateSecondsAgo(50),
                    },
                },
                100,
            ),
        ).resolves.toBeTruthy();
        expect(getAscendingJobUltrasoundHistory.calledOnce).toBeTruthy();
    });
});

describe('hasUltrasoundTemperatureAnormaly', () => {
    const sandbox = sinon.createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it('should return false if job is not at play', async () => {
        await expect(
            hasUltrasoundTemperatureAnormaly(
                {
                    jobId: '1',
                    status: 'frozen',
                },
                {
                    name: 'pronew004',
                    plan: {
                        ultrasound: 10,
                        tens: 10,
                    },
                },
                {
                    temperature: 0,
                    time: {
                        startedAt: new Date(),
                        timeRemain: {
                            value: 100,
                            unit: 'second',
                        },
                    },
                },
                100,
            ),
        ).resolves.toBeFalsy();
    });

    it('should return false if plan has no ultrasound', async () => {
        await expect(
            hasUltrasoundTemperatureAnormaly(
                {
                    jobId: '1',
                    status: 'play',
                },
                {
                    name: 'pronew004',
                    plan: {
                        ultrasound: 0,
                        tens: 10,
                    },
                },
                {
                    temperature: 0,
                    time: {
                        startedAt: new Date(),
                        timeRemain: {
                            value: 100,
                            unit: 'second',
                        },
                    },
                },
                100,
            ),
        ).resolves.toBeFalsy();
    });

    it('should return false if ultrasound has not started', async () => {
        await expect(
            hasUltrasoundTemperatureAnormaly(
                {
                    jobId: '1',
                    status: 'play',
                },
                {
                    name: 'pronew004',
                    plan: {
                        ultrasound: 10,
                        tens: 10,
                    },
                },
                {
                    temperature: 0,
                },
                100,
            ),
        ).resolves.toBeFalsy();
    });

    it('should return false if ultrasound has run less than the considered range', async () => {
        await expect(
            hasUltrasoundTemperatureAnormaly(
                {
                    jobId: '1',
                    status: 'play',
                },
                {
                    name: 'pronew004',
                    plan: {
                        ultrasound: 10,
                        tens: 10,
                    },
                },
                {
                    temperature: 0,
                    time: {
                        startedAt: getDateSecondsAgo(50), // 50 seconds ago
                        timeRemain: {
                            value: 100,
                            unit: 'second',
                        },
                    },
                },
                100,
            ),
        ).resolves.toBeFalsy();
    });

    it('should return false if ultrasound intensity is more than zero', async () => {
        await expect(
            hasUltrasoundTemperatureAnormaly(
                {
                    jobId: '1',
                    status: 'play',
                },
                {
                    name: 'pronew004',
                    plan: {
                        ultrasound: 10,
                        tens: 10,
                    },
                },
                {
                    temperature: 10,
                    time: {
                        startedAt: getDateSecondsAgo(200), // 200 seconds ago
                        timeRemain: {
                            value: 100,
                            unit: 'second',
                        },
                    },
                },
                100,
            ),
        ).resolves.toBeFalsy();
    });

    it('should return false if ultrasound intensity has been zero less than the considered range', async () => {
        const getAscendingJobUltrasoundHistory = sandbox
            .stub(job, 'getAscendingJobUltrasoundHistory')
            .resolves([getHistoryWithTemperature(0, 70), getHistoryWithTemperature(0, 50), getHistoryWithTemperature(0, 30)]);
        await expect(
            hasUltrasoundTemperatureAnormaly(
                {
                    jobId: '1',
                    status: 'play',
                },
                {
                    name: 'pronew004',
                    plan: {
                        ultrasound: 10,
                        tens: 10,
                    },
                },
                {
                    temperature: 0,
                    time: {
                        startedAt: getDateSecondsAgo(200), // 200 seconds ago
                        timeRemain: {
                            value: 100,
                            unit: 'second',
                        },
                    },
                },
                100,
            ),
        ).resolves.toBeFalsy();
        expect(getAscendingJobUltrasoundHistory.calledOnce).toBeTruthy();
    });

    it('should return false if ultrasound intensity has not been zero consecutively for more than or equals to the considered range', async () => {
        const mockHistory = [
            getHistoryWithTemperature(0, 101),
            getHistoryWithTemperature(0, 80),
            getHistoryWithTemperature(10, 70),
            getHistoryWithTemperature(0, 50),
            getHistoryWithTemperature(0, 30),
        ];
        const getAscendingJobUltrasoundHistory = sandbox.stub(job, 'getAscendingJobUltrasoundHistory').resolves(mockHistory);
        await expect(
            hasUltrasoundTemperatureAnormaly(
                {
                    jobId: '1',
                    status: 'play',
                },
                {
                    name: 'pronew004',
                    plan: {
                        ultrasound: 10,
                        tens: 10,
                    },
                },
                {
                    temperature: 0,
                    time: {
                        startedAt: getDateSecondsAgo(200), // 200 seconds ago
                        timeRemain: {
                            value: 100,
                            unit: 'second',
                        },
                    },
                },
                100,
            ),
        ).resolves.toBeFalsy();
        expect(getAscendingJobUltrasoundHistory.calledOnce).toBeTruthy();
    });

    it('should return true if ultrasound intensity has been zero more than or equals to the considered range', async () => {
        const getAscendingJobUltrasoundHistory = sandbox
            .stub(job, 'getAscendingJobUltrasoundHistory')
            .resolves([getHistoryWithTemperature(0, 101), getHistoryWithTemperature(0, 70), getHistoryWithTemperature(0, 50), getHistoryWithTemperature(0, 30)]);
        await expect(
            hasUltrasoundTemperatureAnormaly(
                {
                    jobId: '1',
                    status: 'play',
                },
                {
                    name: 'pronew004',
                    plan: {
                        ultrasound: 10,
                        tens: 10,
                    },
                },
                {
                    temperature: 0,
                    time: {
                        startedAt: getDateSecondsAgo(200), // 200 seconds ago
                        timeRemain: {
                            value: 100,
                            unit: 'second',
                        },
                    },
                },
                100,
            ),
        ).resolves.toBeTruthy();
        expect(getAscendingJobUltrasoundHistory.calledOnce).toBeTruthy();
    });
});
