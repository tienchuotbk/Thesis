import mongoose from "mongoose";
import { dbUri } from "../config/index.js";
import { logger } from "../utils/logger.js";

export default async () => {
    mongoose.set("strictQuery", false)
    await mongoose.connect(dbUri, {})
        .then(async () => {
            logger.info(import.meta.url, "APP", 'MongoDB Connected')
            try {
                // const jobs = await Job.find().lean()
                // const jsonData = JSON.stringify(jobs, null, 2);
                // const filePath = path.resolve(__dirname, '../../data/jobs.json');
                // fs.writeFileSync(filePath, jsonData);
            } catch (e) {
                logger.error(import.meta.url, "APP", "MongoDB Connect Error: ", e.message)
            }
        })
        .catch(e => {
            logger.error(import.meta.url, "APP", "MongoDB Connect Error: ", e.message)
        })
}