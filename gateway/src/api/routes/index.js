import { Router } from "express";
import job from "./job.js";
const router = Router()

router.use("/jobs", job)
export default router