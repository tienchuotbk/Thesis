import companyRepo from "../../../models/repository/company.repo.js";

export default async (req, res) => {
    try {
        const companies = await companyRepo.findAll({})
        res.status(200).json({ message: "OK", data: companies });
    } catch (e) {
        res.status(404).json({ message: "ERROR" + e, data: [] });
    }
};
