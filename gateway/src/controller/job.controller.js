import { findAll, getById } from "../service/job.service.js"
const  jobController = {
    findAll: async (req, res) => {
        const { page, order, type, role, sex, exp, age, salary, level, carrer, text, province } = req.query;
        try {
            const filter = {
                type: type,
                role: role,
                sex: sex,
                exp: exp,
                age: age,
                salary: salary,
                level: level,
                // career: carrer,
                text: text,
                province: province
            }
            const options = { limit: 12, skip: (parseInt(page) -1)* 12 }
            const project = { title: 1, url: 1, update_time: 1, category: 1, salary: 1 }
            const jobs = await findAll(filter, order, project, options);
            console.log(jobs[0])
            console.log(jobs[0].totalCount[0])
            const jobData = {
                jobs: jobs[0].totalData,
                totalPage: jobs[0].totalData.length ? (Math.ceil(jobs[0].totalCount[0].total / 12)) : 0,
                currentPage: parseInt(page),
                totalCount: jobs[0].totalData.length ? jobs[0].totalCount[0].total : 0
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