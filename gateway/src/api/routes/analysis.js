import { Router } from "express";
import { getLineData, getMapData, getPieData } from "../controllers/analysis/index.js";

const router = Router()

router.get("/line", getLineData)
router.get("/map", getMapData)
router.get("/pie", getPieData)

export default router