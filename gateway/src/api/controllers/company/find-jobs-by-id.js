import Job from "../../../models/job.js";
import companyRepo from "../../../models/repository/company.repo.js";

export default async (req, res) => {
    const { id } = req.params;
    try {
        const company = await companyRepo.findOne({ _id: id });
        if (!company) {
            return res.status(200).json({ message: "company not found!", })
        }
        const jobs = await Job.find({ companyId: company._id }).lean().exec()
        res.status(200).json({ message: "OK", data: { company, jobs } })
    } catch (e) {
        res.status(404).json({ message: "ERROR" + e, data: null })
    }
}