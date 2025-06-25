import * as apiJson from '../resource/api.json';

export const ENV = process.env;

export const NODE_ENV = ENV.NODE_ENV;

export const LOGLEVEL = ENV.LOGLEVEL ?? 'DEBUG';

export const INTEGRATION = ENV.INTEGRATION ?? 'mock';

export const APPLICATION_NAME = 'controller';

export const API = apiJson;

export const DB_HOST = ENV.DB_HOST ?? API.db.host;

export const USER_BASE_URL = ENV.USER_BASE_URL ?? API.user.baseUrl;

export const ENVIRONMENT = ENV.ENVIRONMENT ?? 'local';

export const PORT = ENV.PORT ?? 8080;

export const DEFAULT_HTTP_JSON_HEADERS = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
};

export const INTERVAL_CHECK_LOCKED_SHUTDOWN_MS = 2000;

export const TRIAL_CHECK_LOCKED_SHUTDOWN = 3;

export const NO_POLL = ENV.NO_POLL === 'true';

export const X_API_KEY = 'x-api-key';

export const ASSIGNEE_PREFIX = 'ANKH';

export const DISABLE_JOB_CHECK = ENV.DISABLE_JOB_CHECK === 'true';

export const NOTIFICATION: typeof apiJson.notifications = {
    slack: {
        deviceerror: ENV.SLACK_DEVICEERROR_URL ?? apiJson.notifications.slack.deviceerror,
        general: ENV.SLACK_GENERAL_URL ?? apiJson.notifications.slack.general,
    },
};

export const TIMEZONE = ENV.TZ ?? 'Asia/Hong_Kong';

export const EXCLUDE_DEVICES = API.poll.ping.excludes.split(',');
export const INCLUDE_DEVICES = API.poll.ping.includes.split(',');

export const QUEUE_POLLING_INTERVAL_MS = Number(ENV.QUEUE_POLLING_INTERVAL_MS ?? API.poll.queue.interval_ms);

export const DEFAULT_OSS_TIMEOUT = Number(ENV.DEFAULT_OSS_TIMEOUT ?? API.oss.timeout);

export const OSS: typeof apiJson.oss = {
    ...apiJson.oss,
    bucket: {
        'acme-repository': {
            ...apiJson.oss.bucket['acme-repository'],
            accessKeyId: ENV.OSS_ACME_ACCESS_KEY_ID ?? apiJson.oss.bucket['acme-repository'].accessKeyId,
            accessKeySecret: ENV.OSS_ACME_SECRET_ACCESS_KEY ?? apiJson.oss.bucket['acme-repository'].accessKeySecret,
        },
    },
};

export const DEFAULT_ASSIGNEE_ROLE = 'device_user';

export const TREATMENT: typeof apiJson.treatment = {
    ...apiJson.treatment,
    anomalies: {
        ...apiJson.treatment.anomalies,
        ultrasound: {
            ...apiJson.treatment.anomalies.ultrasound,
            zero_temperature_duration_seconds: {
                disabled: ENV.ANORMALY_ULTRASOUND_ZERO_TEMPERATURE_DURATION_SECONDS_DISABLED ?? API.treatment.anomalies.ultrasound.zero_temperature_duration_seconds.disabled,
                value: ENV.ANORMALY_ULTRASOUND_ZERO_TEMPERATURE_DURATION_SECONDS ?? API.treatment.anomalies.ultrasound.zero_temperature_duration_seconds.value,
            },
            overheat_duration_seconds: {
                disabled: ENV.ANORMALY_ULTRASOUND_OVERTHEAT_DURATION_SECONDS_DISABLED ?? API.treatment.anomalies.ultrasound.overheat_duration_seconds.disabled,
                value: ENV.ANORMALY_ULTRASOUND_OVERHEAT_DURATION_SECONDS ?? API.treatment.anomalies.ultrasound.overheat_duration_seconds.value,
            },
        },
    },
    approval: {
        ...apiJson.treatment.approval,
        tens: {
            ...apiJson.treatment.approval.tens,
            intensity_limit: {
                ...apiJson.treatment.approval.tens.intensity_limit,
                disabled: ENV.APPROVAL_TENS_INTENSITY_LIMIT_DISABLED ?? API.treatment.approval.tens.intensity_limit.disabled,
                value: ENV.APPROVAL_TENS_INTENSITY_LIMIT ?? API.treatment.approval.tens.intensity_limit.value,
            },
            daily_parts_limit: {
                ...apiJson.treatment.approval.tens.daily_parts_limit,
                disabled: ENV.APPROVAL_TENS_PARTS_LIMIT_DISABLED ?? API.treatment.approval.tens.daily_parts_limit.disabled,
                value: ENV.APPROVAL_TENS_PARTS_LIMIT ?? API.treatment.approval.tens.daily_parts_limit.value,
            },
        },
    },
};

export const DEFAULT_PRONEW_TREATMENT_PLAN = { tens: 10, ultrasound: 10 };
export const HQ_GROUP = 'acme';
