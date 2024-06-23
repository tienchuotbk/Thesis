import Job from "../../models/job.js";
import companyRepo from "../../models/repository/company.repo.js";

export default async function () {
    console.log("START JOB: create company collections")
    try {
        await companyRepo.deleteMany({})
        const jobs = await Job.find({}, { company: 1, logo: 1, location: 1, province: 1 }).batchSize(500)
        console.log("       total jobs: ", jobs.length)
        const companys = []
        const companySet = new Set()
        for (const job of jobs) {
            let province = "";
            if (job.province && Array.isArray(job.province) && job.province.length) {
                province = job.province[0]
            }
            const company = {
                name: job.company,
                logo: job.logo,
                location: job.location,
                province
            }
            if (!companySet.has(company.name)) {
                companys.push(company)
                companySet.add(company.name)
            }
        }
        let companyCreated = []
        if (companys.length) {
            companyCreated = await companyRepo.createMany(companys)
            console.log("       total companies: ", companyCreated.length)
        }

        if (companyCreated.length) {
            for (const job of jobs) {
                const foundCompany = companyCreated.find(company => {
                    if (company.name === job.company) {
                        return true;
                    }
                    return false;
                })
                if (foundCompany) {
                    await Job.updateOne({ _id: job._id }, { $set: { companyId: foundCompany._id } })
                }
            }
        }


        console.log("END JOB: create company collections")
    } catch (e) {
        console.log('job create-company-db error: ', e)
    }
}