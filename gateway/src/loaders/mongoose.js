import mongoose from "mongoose"
import { dbUri } from "../config/index.js";
import Job from "../models/job.js"; 
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async () => {
    mongoose.set("strictQuery", false)
    await mongoose.connect(dbUri, {})
        .then(async() => {
            console.log('Mongodb Connected');
            try {
            // const jobs = await Job.find().lean()
            // const jsonData = JSON.stringify(jobs, null, 2);
            // const filePath = path.resolve(__dirname, '../../data/jobs.json');
            // fs.writeFileSync(filePath, jsonData);
            } catch(e){
                console.log(e)
            }
        })
        .catch(err => {
            console.log('Mongodb connect failed: ', err);
        })
}