
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { getRevenueReport } from "../controllers/revenueReportController.js";

const router = express.Router();

router.get("/", authMiddleware, getRevenueReport);

export default router;
