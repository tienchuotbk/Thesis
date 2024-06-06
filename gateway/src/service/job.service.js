import Job from "../models/job.js"
import mongoose from "mongoose";
export const findAll = (filter, project = {}, options = {}) => {
    // return Job.find(filter, project, options)
    return Job.aggregate([
        {$match: filter},
        {$project: {_id: 1}},
        {$skip: options.skip},
        {$limit: options.limit},
        {$group: { _id: null, total: {$sum: 1 }}}
    ])
}

export const getById = (id, project = {}, options = {}) => {
    const objectId = new mongoose.Types.ObjectId(id);
    return Job.findOne(objectId, project, options)
}