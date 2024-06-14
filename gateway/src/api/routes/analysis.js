import { Router } from "express";
import { getLineData } from "../controllers/analysis/index.js";

const router = Router()

router.get("/line", getLineData)

export default router