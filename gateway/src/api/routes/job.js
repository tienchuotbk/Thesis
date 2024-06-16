import { Router } from "express";
import { findAll, findOne, findRecommend } from "../controllers/job/index.js";

const router = Router()

router.get("/", findAll)
router.get("/:id", findOne)
router.get('/:id/recommend', findRecommend)

export default router