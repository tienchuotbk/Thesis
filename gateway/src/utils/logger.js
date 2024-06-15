import path from 'path';
import { LOGGER_LEVEL } from "../contants/log.const.js";
import Log from "../models/log.js";

const buildLog = (fileUrl, level, domain, message) => {
    const now = new Date();
    const date = now.toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    const time = now.toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    const log = {
        filename: `${path.basename(fileUrl)}`,
        level: level,
        domain: `${domain ? domain : 'app'}`,
        message: message instanceof Error ? message.stack : message,
        time: `${date} ${time}`,
    };
    return JSON.stringify(log);
};

export const logger = {
    info: (fileUrl, domain, message) => {
        console.info(buildLog(fileUrl, LOGGER_LEVEL.INFO, domain, message));
    },
    warn: (fileUrl, domain, message) => {
        console.warn(buildLog(fileUrl, LOGGER_LEVEL.WARN, domain, message));
    },
    error: (fileUrl, domain, message) => {
        console.error(buildLog(fileUrl, LOGGER_LEVEL.ERROR, domain, message));
    },
    debug: (fileUrl, domain, message) => {
        console.debug(buildLog(fileUrl, LOGGER_LEVEL.DEBUG, domain, message));
    },
};

export default async (code, userId, errorMessage, level, req) => {
    let ip = 'no-ip'
    const log = new Log({
        resultCode: code,
        level,
        errorMessage: errorMessage,
        ip: ip
    })

    if (userId !== '' && userId) log.userId = userId;
    await log.save().catch(err => {
        console.log('Logging is failed: ' + err);
    })
}