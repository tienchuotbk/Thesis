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
        // console.log(ex);
        logger('00002', '', ex.message, 'Unhandled Rejection', '');
    });

    app.use(cors())
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json());
    app.use(morgan("dev"))
    app.use(helmet())
    app.use(prefix, routes)
}