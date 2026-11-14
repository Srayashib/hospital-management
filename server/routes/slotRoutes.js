// import express from "express";
// import authMiddleware from "../middlewares/authMiddleware.js";

// import {
//   getAvailableSlots,
//   getSlotsByDate,
//   getSlotsByDoctorAndDate,
// } from "../controllers/slotController.js";

// const router = express.Router();


// // ==========================================
// // GET ALL AVAILABLE SLOTS
// // ==========================================

// // router.get(
// //   "/",
// //   authMiddleware,
// //   getAvailableSlots
// // );
// router.get(
//   "/slots",
//   authMiddleware,
//   getAvailableSlots
// );

// // ==========================================
// // GET SLOTS BY DATE
// // ==========================================

// router.get(
//   "/date/:date",
//   authMiddleware,
//   getSlotsByDate
// );


// // ==========================================
// // GET SLOTS BY DOCTOR + DATE
// // ==========================================

// router.get(
//   "/doctor/:doctorId/date/:date",
//   authMiddleware,
//   getSlotsByDoctorAndDate
// );


// export default router;


import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";

import {
  getAvailableSlots,
  getSlotsByDate,
  getSlotsByDoctorAndDate,
} from "../controllers/slotController.js";

const router = express.Router();


// ==========================================
// GET ALL AVAILABLE SLOTS
// ==========================================

router.get(
  "/slots",
  authMiddleware,
  getAvailableSlots
);


// ==========================================
// GET SLOTS BY DATE
// ==========================================

router.get(
  "/slots/date/:date",
  authMiddleware,
  getSlotsByDate
);


// ==========================================
// GET SLOTS BY DOCTOR + DATE
// ==========================================

router.get(
  "/slots/doctor/:doctorId/date/:date",
  authMiddleware,
  getSlotsByDoctorAndDate
);


export default router;