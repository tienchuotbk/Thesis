import bodyParser from "body-parser";
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import logger from "../utils/logger.js";
import { prefix } from "../config/index.js";
import routes from '../api/routes/index.js'

export default (app) => {
    process.on("uncaughtException", async (error) => {
        logger('00001', '', error.message, 'Uncaught Exception', '');
    })

    process.on('unhandledRejection', async (ex) => {
        logger('00002', '', ex.message, 'Unhandled Rejection', '');
    });

    app.use(cors())
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json());
    app.use(morgan("dev"))
    app.use(helmet())
    app.use(prefix, routes)

    app.use((_req, _res, next) => {
        const error = new Error('Endpoint could not find!');
        error.status = 404;
        next(error);
    });

    app.use((error, req, res, _next) => {
        res.status(error.status || 500);
        let resultCode = '00015';
        let level = 'External Error';
        if (error.status === 500) {
            resultCode = '00013';
            level = 'Server Error';
        } else if (error.status === 404) {
            resultCode = '00014';
            level = 'Client Error';
        }
        return res.json({
            resultMessage: {
                en: error.message,
                vi: error.message
            },
            resultCode: resultCode,
        });

    });
}