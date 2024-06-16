import { Router } from "express";
import { getLineData, getMapData } from "../controllers/analysis/index.js";

const router = Router()

router.get("/line", getLineData)
router.get("/map", getMapData)

export default router