import express from "express";

import {
  getPatientProfile,
  updatePatientProfile,
  updateNotificationPreferences,
  updatePrivacySettings,
  updateAppointmentPreferences,
  deletePatientAccount,
  changePatientPassword,
  getDepartments,
  getDoctorsByDepartment,
  getDoctorSlots,
  getPatientDashboardStats,
} from "../controllers/patientProfileController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

/* =====================================================
   TEST PATIENT ROUTE
===================================================== */

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Patient route is working",
  });
});

/* =====================================================
   PATIENT PROFILE
===================================================== */

router.get(
  "/profile",
  authMiddleware,
  getPatientProfile
);

router.put(
  "/profile",
  authMiddleware,
  updatePatientProfile
);

/* =====================================================
   NOTIFICATIONS
===================================================== */

router.put(
  "/profile/notifications",
  authMiddleware,
  updateNotificationPreferences
);

/* =====================================================
   PRIVACY
===================================================== */

router.put(
  "/profile/privacy",
  authMiddleware,
  updatePrivacySettings
);

/* =====================================================
   APPOINTMENT PREFERENCES
===================================================== */

router.put(
  "/profile/appointments",
  authMiddleware,
  updateAppointmentPreferences
);

/* =====================================================
   DELETE PATIENT ACCOUNT
===================================================== */

router.delete(
  "/account",
  authMiddleware,
  deletePatientAccount
);

router.put(
  "/change-password",
  authMiddleware,
  changePatientPassword
)

router.get(
  '/departments',
  authMiddleware,
  getDepartments
)

router.get(
  "/doctors",
  authMiddleware,
  getDoctorsByDepartment
)
router.get(
  "/doctors/:doctorId/slots",
  authMiddleware,
  getDoctorSlots
);
router.get(
  "/dashboard/stats",
  authMiddleware,
  getPatientDashboardStats
);
export default router;