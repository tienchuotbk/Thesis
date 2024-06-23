import { Router } from "express";
import { findAll, findOne, findJobsById,analytics } from "../controllers/company/index.js";

const router = Router()

router.get("/", findAll)
router.get("/analytics", analytics)
router.get("/:id", findOne)
router.get('/:id/jobs', findJobsById)
export default router