import jobRepo from "../../../models/repository/job.repo.js";

export default async (req, res) => {
    const { page, order, type, role, sex, exp, age, salary, level, career, text, province, } = req.query;
    let limit = 1;
    if (req.query.limit && !isNaN(req.query.limit)) {
        limit = parseInt(req.query.limit)
    }
    
    try {
        const filter = {
            type: type,
            role: role,
            sex: sex,
            exp: exp,
            age: age,
            salary: salary,
            level: level,
            career: career,
            text: text,
            province: province
        }
        const options = { limit, skip: (parseInt(page) - 1) * limit }
        const project = { title: 1, url: 1, update_time: 1, category: 1, salary: 1 }
        const jobs = await jobRepo.findAll(filter, order, project, options);
        const jobData = {
            jobs: jobs[0].totalData,
            totalPage: jobs[0].totalData.length ? (Math.ceil(jobs[0].totalCount[0].total / 12)) : 0,
            currentPage: parseInt(page),
            totalCount: jobs[0].totalData.length ? jobs[0].totalCount[0].total : 0
        }
        res.status(200).json({ message: "OK", data: jobData });
    }
    catch (e) {
        res.status(404).json({ message: "ERROR" + e, data: [] });
    }
}
