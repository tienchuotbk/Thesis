import { Router } from "express";
import job from "./job.js";
const router = Router()

router.get("/job", job)
export default router