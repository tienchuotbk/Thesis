import mongoose from "mongoose";
import { filterAggregate } from "../../helper/filter.js";
import Job from "../job.js"
// import searchFullText from "./elastic.js";

const jobRepo = {
    findAll: async (filter, order, project = {}, options = {}) => {
        let orderOption = [];

        if (order == "lastest") {
            orderOption = [{ $sort: { "update_time": 1 } }];
        } else if (order == "title") {
            orderOption = [{ $sort: { "title": 1 } }];
        } else {
            orderOption = [{ $sort:  { score: { $meta: "textScore" } } }];
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
                                score: { $meta: "textScore" },
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
    }
}

export default jobRepo