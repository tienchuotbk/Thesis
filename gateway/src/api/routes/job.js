import { Router } from "express";
import { findAll, findOne, findRecommend, findRecents } from "../controllers/job/index.js";

const router = Router()

router.get("/", findAll)
router.get("/:id", findOne)
router.get("/:id/recents", findRecents)
router.get('/:id/recommend', findRecommend)

export default router