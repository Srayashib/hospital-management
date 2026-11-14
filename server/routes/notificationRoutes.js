import express from "express";

import {
  getNotifications,
  markNotificationAsRead,
} from "../controllers/notificationController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();


router.get(
  "/",
  authMiddleware,
  getNotifications
);


router.patch(
  "/:id/read",
  authMiddleware,
  markNotificationAsRead
);


export default router;