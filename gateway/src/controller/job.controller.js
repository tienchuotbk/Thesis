import { findAll, getById } from "../service/job.service.js"
const  jobController = {
    findAll: async (req, res) => {
        const { page } = req.query;
        try {
            const filter = {}
            const options = { limit: 12, skip: (parseInt(page) -1)* 12 }
            const project = { title: 1, url: 1, update_time: 1, category: 1, salary: 1 }
            const jobs = await findAll(filter, project, options);
            const jobData = {
                jobs: jobs[0].totalData,
                totalPage: Math.ceil(jobs[0].totalCount[0].total / 12),
                currentPage: parseInt(page),
                totalCount: jobs[0].totalCount[0].total
            }
            res.status(200).json({ message: "OK", data: jobData });
        }
        catch(e){
            console.log(e);
            res.status(404).json({ message: "ERROR"+ e, data: [] });
        }
    },
    getById: async(req, res) => {
        const { id } = req.query;
        try {
            const job = await getById(id);
            res.status(200).json({ message: "OK", data: job })
        } catch(e){
            console.log(e)
            res.status(404).json({ message: "ERROR"+ e, data: null })
        }

    }
}

export default jobController

// module.exports = {
//     findAll
// }