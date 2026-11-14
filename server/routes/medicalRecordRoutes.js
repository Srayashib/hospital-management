import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";

import createMedicalRecordUploadMiddleware
  from "../middlewares/medicalRecordUploadMiddleware.js";

import {
  completeAppointment,
  getMyMedicalHistory,
  getMedicalRecordByAppointment,
  getDoctorPatientMedicalHistory,
} from "../controllers/medicalRecordController.js";


const router = express.Router();


/* =====================================================
   MEDICAL RECORD UPLOAD
===================================================== */

const upload =
  createMedicalRecordUploadMiddleware();
/* =====================================================
   GET PATIENT MEDICAL HISTORY
===================================================== */

router.get(
  "/medical-history",
  authMiddleware,
  getMyMedicalHistory
);

// router.get(
//   "/appointments/:appointmentId/medical-record",
//   authMiddleware,
//   getMedicalRecordByAppointment
// );
router.get(
  "/patients/:patientId/medical-history",
  authMiddleware,
  getDoctorPatientMedicalHistory
);
/* =====================================================
   COMPLETE APPOINTMENT
===================================================== */

router.post(

  "/appointments/:appointmentId/complete",

  authMiddleware,

  upload.fields([

    {
      name: "prescriptionFile",
      maxCount: 1,
    },

    {
      name: "labReportFile",
      maxCount: 1,
    },

    {
      name: "otherMedicalFile",
      maxCount: 1,
    },

  ]),

  completeAppointment

);


export default router;