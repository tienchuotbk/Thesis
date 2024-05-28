import { Router } from "express";

const router = Router()
router.get("/ping", (req, res) => res.status(200).json({ message: "OK" }))
export default router