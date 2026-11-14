import express from "express";

import {
  applyLeave,
  getMyLeaves, cancelLeave,  getAllLeaves,  getPendingLeaves,
  getPendingLeaveCount,approveLeave, rejectLeave
} from "../controllers/leaveController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/apply",
  authMiddleware,
  applyLeave
);

router.get(
  "/my-leaves",
  authMiddleware,
  getMyLeaves
);

router.put(
  "/cancel/:id",
  authMiddleware,
  cancelLeave
);
router.get(
  "/all",
  authMiddleware,
  getAllLeaves
);

router.get(
  "/pending",
  authMiddleware,
  getPendingLeaves
);


router.get(
  "/pending/count",
  authMiddleware,
  getPendingLeaveCount
);
router.put(
  "/approve/:id",
  authMiddleware,
  approveLeave
);

router.put(
  "/reject/:id",
  authMiddleware,
  rejectLeave
);
export default router;