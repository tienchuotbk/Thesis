import { Router } from "express";
import job from "./job.js";
import analysis from "./analysis.js";
import company from "./comapny.js";
const router = Router()

router.use("/jobs", job)
router.use("/analysis", analysis);
router.use("/companies", company);
export default router