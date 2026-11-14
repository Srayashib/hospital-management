import express from "express";

import {
  bookAppointment,
  getMyAppointments,
  getReceptionistAppointmentSummary,
   getPatientCompletedPayments,
} from "../controllers/appointmentController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();


/*
=====================================================
PATIENT BOOK APPOINTMENT
=====================================================
*/

router.post(
  "/book",
 authMiddleware,
  bookAppointment
);

router.get(
  "/my",
  authMiddleware,
  getMyAppointments
);

router.get(
  "/summary",
  authMiddleware,
  getReceptionistAppointmentSummary
);
router.get(
  "/payments",
  authMiddleware,
  getPatientCompletedPayments
);
export default router;