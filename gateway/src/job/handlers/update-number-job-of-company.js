import Job from "../../models/job.js";
import companyRepo from "../../models/repository/company.repo.js";

export default async function () {
    console.log("START JOB: update number job of company")
    try {
        const companies = await companyRepo.findAll({}, { _id: 1 })
        for (const company of companies) {
            const numberJobOfCompany = await Job.countDocuments({ companyId: company._id })
            await companyRepo.updateOne({ _id: company._id }, { $set: { numberJob: numberJobOfCompany } })
        }
        console.log("END JOB: update number job of company")
    } catch (e) {
        console.log('job update-number-job-of-company error: ', e)
    }
}