import express from "express";

import {
  getHospitalSettings,
  updateHospitalInformation,
  updateWorkingHours,
  updateAppointmentSettings,
  updateSystemSettings,
} from "../controllers/hospitalSettingsController.js";


const router = express.Router();


// ==========================================
// GET HOSPITAL SETTINGS
// ==========================================

router.get(
  "/",
  getHospitalSettings
);


// ==========================================
// UPDATE HOSPITAL INFORMATION
// ==========================================

router.put(
  "/hospital-information",
  updateHospitalInformation
);

router.put(
  "/working-hours",
  updateWorkingHours
);
router.put(
  "/appointment-settings",
  updateAppointmentSettings
);
router.put(
  "/system-settings",
  updateSystemSettings
);
export default router;