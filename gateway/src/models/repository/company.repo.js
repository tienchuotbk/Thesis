import Company from "../company.js"

const companyRepo = {
    findAll: (filter, project, options = {}) => Company.find(filter, project, options).lean().exec(),
    findOne: (filter, project, options = {}) => Company.findOne(filter, project, options).lean().exec(),
    create: (data) => Company.create(data),
    createMany: listData => Company.insertMany(listData),
    updateOne: (filter, data) => Company.updateOne(filter, data),
    updateMany: (filter, data) => Company.updateMany(filter, data),
    deleteOne: (filter) => Company.deleteOne(filter),
    deleteMany: (filter) => Company.deleteMany(filter)
}

export default companyRepo