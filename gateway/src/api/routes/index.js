import { Router } from "express";
import jobController from "../../controller/job.controller.js";
const router = Router()
router.get("/", jobController.findAll)
router.get("/job", jobController.getById)
export default router