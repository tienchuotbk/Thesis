import companyRepo from "../../../models/repository/company.repo.js";

export default async (req, res) => {
    try {
        const companies = await companyRepo.findAll({}, {}, { sort: { numberJob: -1 }, limit: 10 })
        res.status(200).json({ message: "OK", data: { top_10: companies } })
    } catch (e) {
        res.status(404).json({ message: "ERROR" + e, data: null })
    }
}