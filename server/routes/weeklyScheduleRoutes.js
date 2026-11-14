import express from "express";
import { addWeeklySchedule, getWeeklySchedule } from "../controllers/weeklyScheduleController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/schedule",
  authMiddleware,
  addWeeklySchedule
);

router.get(
  "/schedule",
  authMiddleware,
  getWeeklySchedule
);

export default router;