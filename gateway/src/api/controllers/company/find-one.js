import companyRepo from "../../../models/repository/company.repo.js";

export default async (req, res) => {
    const { id } = req.params;
    try {
        const company = await companyRepo.findOne({ _id: id });
        res.status(200).json({ message: "OK", data: company })
    } catch (e) {
        res.status(404).json({ message: "ERROR" + e, data: null })
    }
}