import { Router } from "express";
import jobRepo from "../../models/repository/job.repo.js";

const router = Router()
router.get("/ping", async (req, res) => {
    const jobs = await jobRepo.findAll({}, {}, { limit: 2 })
    return res.status(200).json({ message: "OK", jobs })
})
export default router