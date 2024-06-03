import { findAll, getById } from "../service/job.service.js"
const  jobController = {
    findAll: async (req, res) => {
        const { page } = req.query;
        try {
            // console.log(page)
            const filter = {}
            const options = { limit: 10 }
            const project = { title: 1, url: 1, update_time: 1, category: 1, salary: 1 }
            const jobs = await findAll(filter, project, options);
            res.status(200).json({ message: "OK", data: jobs })
        }
        catch(e){
            console.log(e);
            res.status(404).json({ message: "ERROR"+ e, data: [] })
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