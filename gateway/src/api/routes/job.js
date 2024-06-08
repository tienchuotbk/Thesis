import { Router } from "express";
import { findAll, findOne } from "../controllers/job/index.js";

const router = Router()

router.get("/", findAll)
router.get("/:id", findOne)

export default router