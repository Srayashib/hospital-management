// import express from "express";
// import uploadMiddleware from "../middlewares/uploadMiddleware.js";
// import { getDoctors,addDoctor,deleteDoctors,getDoctorById,updateDoctor, getMyProfile,} from "../controllers/doctorController.js";

// const router=express.Router();
// // router.post("/add",uploadMiddleware.single("image"),addDoctor);
// router.post(
//   "/add",
//   uploadMiddleware("doctors").single("image"),
//   addDoctor
// );
// router.get("/",getDoctors);
// router.delete("/:id",deleteDoctors)
// router.get("/:id", getDoctorById);
// // router.put("/:id",uploadMiddleware.single("image"), updateDoctor );
// router.put(
//   "/:id",
//   uploadMiddleware("doctors").single("image"),
//   updateDoctor
// );
// router.get(
//   "/my-profile",
  
//   getMyProfile
// );

// export default router;

import express from "express";
import uploadMiddleware from "../middlewares/uploadMiddleware.js";

import {
  getDoctors,
  addDoctor,
  deleteDoctors,
  getDoctorById,
  updateDoctor,
  getMyProfile,
  getDoctorsByDepartment,
  getDoctorTodayAppointments,
  getDoctorAllTodayAppointments,
  getDoctorPatients
} from "../controllers/doctorController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import {
  getDoctorPatientMedicalHistory,
  updatePatientVitals,
} from "../controllers/medicalRecordController.js";
const router = express.Router();


// ==========================================
// CREATE DOCTOR
// ==========================================

router.post(
  "/add",
  uploadMiddleware("doctors").single("image"),
  addDoctor
);


// ==========================================
// GET MY PROFILE
// IMPORTANT: MUST COME BEFORE /:id
// ==========================================

router.get(
  "/my-profile",
  authMiddleware,
  getMyProfile
);
router.get(
  "/my-appointments/today",
  authMiddleware,
  getDoctorTodayAppointments
);
router.get(
  "/my-appointments/today-all",
  authMiddleware,
  getDoctorAllTodayAppointments
);
// ==========================================
// GET ALL DOCTORS
// ==========================================

router.get(
  "/",
  getDoctors
);

// ==========================================
// GET DOCTOR BY ID
// ==========================================

router.get("/by-department", getDoctorsByDepartment);
router.get(
  "/my-patients",
  authMiddleware,
  getDoctorPatients
);
router.get("/:id", getDoctorById);
// ==========================================
// DELETE DOCTOR
// ==========================================

router.delete(
  "/:id",
  deleteDoctors
);


// ==========================================
// UPDATE DOCTOR
// ==========================================

router.put(
  "/:id",
  uploadMiddleware("doctors").single("image"),
  updateDoctor
);

router.put(
  "/patients/:patientId/vitals",
  authMiddleware,
  updatePatientVitals
);
export default router;