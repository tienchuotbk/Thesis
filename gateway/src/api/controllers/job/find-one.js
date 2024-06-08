import jobRepo from "../../../models/repository/job.repo.js";

export default async (req, res) => {
    const { id } = req.query;
    try {
        const job = await jobRepo.getById(id);
        res.status(200).json({ message: "OK", data: job })
    } catch (e) {
        console.log(e)
        res.status(404).json({ message: "ERROR" + e, data: null })
    }

}