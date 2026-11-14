// import express from "express";

// import uploadMiddleware from "../middlewares/uploadMiddleware.js";
// import authMiddleware from "../middlewares/authMiddleware.js";

// import {
//   addReceptionist,
//   getReceptionists,
//   deleteReceptionist,
//   getReceptionistById,
//   updateReceptionist,
//   searchPatientByEmail,
// } from "../controllers/receptionistController.js";
// import {
//   receptionistBookAppointment,
// } from "../controllers/appointmentController.js";

// import {
//   getReceptionistAppointmentSummary,
//   getReceptionistAppointments,
// } from "../controllers/appointmentController.js";
// const router = express.Router();


// // ===============================
// // GET ALL RECEPTIONISTS
// // ===============================

// router.get(
//   "/",
//   authMiddleware,
//   getReceptionists
// );


// // ===============================
// // ADD RECEPTIONIST
// // ===============================

// // router.post(
// //   "/add",
// //   authMiddleware,
// //   uploadMiddleware.single("image"),
// //   addReceptionist
// // );

// router.post(
//   "/add",
//   authMiddleware,
//   uploadMiddleware("receptionists").single("image"),
//   addReceptionist
// );
// // ===============================
// // GET RECEPTIONIST BY ID
// // ===============================
// router.get(
//   "/patients/search",
//   authMiddleware,
//   searchPatientByEmail
// );
// router.get(
//   "/:id",
//   authMiddleware,
//   getReceptionistById
// );


// // ===============================
// // UPDATE RECEPTIONIST
// // ===============================

// router.put(
//   "/:id",
//   authMiddleware,
//   uploadMiddleware("receptionists").single("image"),
//   updateReceptionist
// );
// // ===============================
// // DELETE RECEPTIONIST
// // ===============================

// router.delete(
//   "/:id",
//   authMiddleware,
//   deleteReceptionist
// );


// router.post(
//   "/book-appointment",
//   authMiddleware,
//   receptionistBookAppointment
// );
// router.get(
//   "/appointments",
//   authMiddleware,
//   getReceptionistAppointments
// );

// router.get(
//   "/appointments/summary",
//   authMiddleware,
//   getReceptionistAppointmentSummary
// );
// export default router;
import express from "express";

import uploadMiddleware from "../middlewares/uploadMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";

import {
  addReceptionist,
  getReceptionists,
  deleteReceptionist,
  getReceptionistById,
  updateReceptionist,
  searchPatientByEmail,
  getPatients,
  getReceptionistDashboardStats,
  getReceptionistAppointmentChart,
} from "../controllers/receptionistController.js";

import {
  receptionistBookAppointment,
  getReceptionistAppointmentSummary,
  getReceptionistAppointments,
  updateAppointmentStatus,
  deleteCancelledAppointment,
} from "../controllers/appointmentController.js";

const router = express.Router();


// =====================================================
// GET ALL RECEPTIONISTS
// =====================================================

router.get("/", authMiddleware, getReceptionists);

router.post(
  "/add",
  authMiddleware,
  uploadMiddleware("receptionists").single("image"),
  addReceptionist
);

router.get(
  "/patients",
  authMiddleware,
  getPatients
);


router.get(
  "/patients/search",
  authMiddleware,
  searchPatientByEmail
);


// ===============================
// APPOINTMENT ROUTES
// IMPORTANT: BEFORE /:id
// ===============================

router.post(
  "/book-appointment",
  authMiddleware,
  receptionistBookAppointment
);

router.get(
  "/appointments",
  authMiddleware,
  getReceptionistAppointments
);

router.get(
  "/appointments/summary",
  authMiddleware,
  getReceptionistAppointmentSummary
);
router.patch(
  "/appointments/:id/status",
  authMiddleware,
  updateAppointmentStatus
);
// =====================================================
// APPOINTMENT CHART
// IMPORTANT: BEFORE /:id
// =====================================================

router.get(
  "/dashboard/appointment-chart",
  authMiddleware,
  getReceptionistAppointmentChart
);
// ===============================
// RECEPTIONIST ID ROUTES
// KEEP THESE AFTER APPOINTMENTS
// ===============================

router.get(
  "/:id",
  authMiddleware,
  getReceptionistById
);

router.put(
  "/:id",
  authMiddleware,
  uploadMiddleware("receptionists").single("image"),
  updateReceptionist
);

router.delete(
  "/:id",
  authMiddleware,
  deleteReceptionist
);

router.delete(
  "/appointments/:id",
  authMiddleware,
  deleteCancelledAppointment
);

router.get(
  "/dashboard/stats",
  authMiddleware,
  getReceptionistDashboardStats
);
export default router;