import Log from "../models/log.js"

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