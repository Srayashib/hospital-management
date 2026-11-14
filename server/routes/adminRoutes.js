import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

import {
  getAdminPatients,
  deleteAdminPatient,
  getAdminRecentAppointments,
   getAdminDashboardStats,
   
} from "../controllers/adminController.js";

const router = express.Router();

router.get(
  "/patients",
  authMiddleware,
  getAdminPatients
);
router.delete(
  "/patients/:patientId",
  authMiddleware,
  deleteAdminPatient
);
router.get(
  "/appointments/recent",
  authMiddleware,
  getAdminRecentAppointments
);
router.get(
  "/dashboard/stats",
  authMiddleware,
  getAdminDashboardStats
);
export default router;