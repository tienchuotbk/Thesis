import { Router } from "express";
import job from "./job.js";
import analysis from "./analysis.js";
const router = Router()

router.use("/jobs", job)
router.use("/analysis", analysis);
export default router