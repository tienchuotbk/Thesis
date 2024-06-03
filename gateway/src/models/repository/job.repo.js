import Job from "../job.js"

const jobRepo = {
    findAll: (filter, project = {}, options = {}) => Job.find(filter, project, options)
}

export default jobRepo