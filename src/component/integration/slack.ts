import axios from 'axios';
import { APPLICATION_NAME, INTEGRATION, NOTIFICATION } from '../constant';
import { logger } from '../logger';

const slackSender = async (channel: keyof typeof NOTIFICATION.slack, attachments: any[]) => {
    await axios.post(NOTIFICATION.slack[channel], {
        attachments,
    });
};

const sendSlackErrorMessage = (channel: keyof typeof NOTIFICATION.slack) => {
    return async (msg: string) => {
        try {
            await slackSender(channel, [
                {
                    fallback: msg,
                    color: 'danger',
                    title: `:no_entry_sign: ${APPLICATION_NAME} error`,
                    text: msg,
                    footer: APPLICATION_NAME,
                    footer_icon: undefined,
                    ts: (new Date().getTime() / 1000) | 0,
                },
            ]);
        } catch (e) {
            logger.error(`Unable to send message. Unexpected error logging message: ${e}`);
        }
    };
};

const sendSlackWarningMessage = async (msg: string) => {
    try {
        await slackSender('general', [
            {
                fallback: msg,
                color: 'warning',
                title: `${APPLICATION_NAME} warning`,
                text: msg,
                footer: APPLICATION_NAME,
                footer_icon: undefined,
                ts: (new Date().getTime() / 1000) | 0,
            },
        ]);
    } catch (e) {
        logger.error(`Unable to send message. Unexpected warning logging message: ${e}`);
    }
};

export const sendDeviceErrorMessage = INTEGRATION === 'real' ? sendSlackErrorMessage('deviceerror') : async (msg: string) => logger.error(msg);
export const sendErrorMessage = INTEGRATION === 'real' ? sendSlackErrorMessage('general') : async (msg: string) => logger.error(msg);
export const sendWarningMessage = INTEGRATION === 'real' ? sendSlackWarningMessage : async (msg: string) => logger.warn(msg);
