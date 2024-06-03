import Job from "../models/job.js"
import mongoose from "mongoose";
export const findAll = (filter, project = {}, options = {}) => {
    return Job.find(filter, project, options)
}

export const getById = (id, project = {}, options = {}) => {
    const objectId = new mongoose.Types.ObjectId(id);
    return Job.findOne(objectId, project, options)
}