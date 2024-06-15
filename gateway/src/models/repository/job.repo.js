import mongoose from "mongoose";
import { filterAggregate } from "../../helper/filter.js";
import Job from "../job.js";
// import searchFullText from "./elastic.js";

const jobRepo = {
  findAll: async (filter, order, project = {}, options = {}) => {
    let orderOption = [];
    let filter_score = {};
    if (filter.text && filter.text.length) {
      filter_score = { score: { $meta: "textScore" } };
    }

    if (order == "lastest") {
      orderOption = [{ $sort: { update_time: 1 } }];
    } else if (order == "title") {
      orderOption = [{ $sort: { title: 1 } }];
    } else {
      orderOption = [{ $sort: { ...filter_score } }];
    }

    return Job.aggregate([
      ...filterAggregate(filter),
      {
        $facet: {
          totalData: [
            ...orderOption,
            { $skip: options.skip },
            { $limit: options.limit },
            {
              $project: {
                _id: 1,
                title: 1,
                salary: 1,
                category: 1,
                company: 1,
                logo: 1,
                update_time: 1,
                ...filter_score,
              },
            }, // Include other fields you want to retrieve
          ],
          totalCount: [{ $group: { _id: null, total: { $sum: 1 } } }],
        },
      },
    ]);
  },

  getById: (id, project = {}, options = {}) => {
    const objectId = new mongoose.Types.ObjectId(id);
    return Job.findOne(objectId, project, options);
  },
  getAgeLine: () => {
    return Job.aggregate([
      {
        $project: {
          ageRange: {
            $switch: {
              branches: [
                {
                  case: { $eq: ["$age.type", 1] },
                  then: { $range: ["$age.min", { $add: ["$age.max", 1] }] }, // range(min, max+1)
                },
                {
                  case: { $eq: ["$age.type", 2] },
                  then: ["$age.fixed"], // single value as array
                },
                {
                  case: { $eq: ["$age.type", 3] },
                  then: { $range: ["$age.min", 61] }, // range(min, 60+1)
                },
                {
                  case: { $eq: ["$age.type", 4] },
                  then: { $range: [16, { $add: ["$age.max", 1] }] }, // range(16, max+1)
                },
              ],
              default: [],
            },
          },
        },
      },
      { $unwind: "$ageRange" },
      {
        $group: {
          _id: "$ageRange",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  },
  getLine: () => {
    const values = Array.from({ length: 60 - 16 + 1 }, (_, i) => i + 16);

    // Build the facets dynamically
    const facets = values.reduce((acc, value) => {
      acc[value] = [
        {
          $match: {
            $or: [
              {
                $and: [
                  { "age.type": 1 },
                  { "age.min": { $lte: value } },
                  { "age.max": { $gte: value } },
                ],
              },
              { $and: [{ "age.type": 2 }, { "age.fixed": value }] },
              { $and: [{ "age.type": 3 }, { "age.max": { $gt: value } }] },
              { $and: [{ "age.type": 4 }, { "age.min": { $lt: value } }] },
            ],
          },
        },
        { $count: "count" },
      ];
      return acc;
    }, {});

    return Job.aggregate([
      {
        $facet: facets,
      },
      {
        $project: {
          counts: {
            $objectToArray: "$$ROOT",
          },
        },
      },
      {
        $unwind: "$counts",
      },
      {
        $project: {
          age: "$counts.k",
          count: { $ifNull: [{ $arrayElemAt: ["$counts.v.count", 0] }, 0] },
        },
      },
    ]);
  },
};

export default jobRepo;
