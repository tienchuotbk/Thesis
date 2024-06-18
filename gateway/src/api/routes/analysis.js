import { Router } from "express";
import { getLineData, getMapData, getPieData, getTableData } from "../controllers/analysis/index.js";

const router = Router()

router.get("/line", getLineData)
router.get("/map", getMapData)
router.get("/pie", getPieData)
router.get("/table", getTableData)

export default router