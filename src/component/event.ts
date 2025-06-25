import { EventDetail } from '../types/event';
import { components } from '../types/schema';

export type ReportDetail = components['schemas']['JobHistory'] | components['schemas']['ErrorHistory'] | components['schemas']['Acknowledgement'];

export function toEventResponseDetail(detail: EventDetail): components['schemas']['Event']['detail'] {
    if ('report' in detail) {
        if ('type' in detail.report && detail.report.type === 'acknowledgement') {
            return {
                deviceId: detail.deviceId,
                report: {
                    type: 'acknowledgement',
                    detail: detail.report.detail,
                },
            };
        } else if (Array.isArray(detail.report)) {
            return {
                deviceId: detail.deviceId,
                report: detail.report.map(report => ({
                    type: report.type,
                    detail: report.detail,
                })),
            };
        } else {
            return {};
        }
    } else {
        return {};
    }
}
