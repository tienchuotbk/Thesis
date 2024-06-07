import Job from "../models/job.js";
import mongoose from "mongoose";
import { filterAggregate } from "../helper/filter.js";
export const findAll = (filter, order, project = {}, options = {}) => {
  // return Job.find(filter, project, options)
  return Job.aggregate([
    ...filterAggregate(filter),
    {
      $facet: {
        totalData: [
          { $skip: options.skip },
          { $limit: options.limit },
          { $project: { _id: 1, title: 1, salary: 1, category: 1, company: 1  } }, // Include other fields you want to retrieve
        ],
        totalCount: [{ $group: { _id: null, total: { $sum: 1 } } }],
      },
    },
  ]);
};

export const getById = (id, project = {}, options = {}) => {
  const objectId = new mongoose.Types.ObjectId(id);
  return Job.findOne(objectId, project, options);
};
