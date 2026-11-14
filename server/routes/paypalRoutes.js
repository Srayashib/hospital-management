import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";

import {
  createPayPalOrder,
  capturePayPalOrder,
} from "../controllers/paypalController.js";

import {
  getPayPalBrowserSafeClientToken,
} from "../controllers/paypalClientTokenController.js";

import {
  createPayPalQrPayment,
} from "../controllers/paypalQrController.js";

const router = express.Router();

router.get(
  "/browser-safe-client-token",
  authMiddleware,
  getPayPalBrowserSafeClientToken
);

router.post(
  "/create-order",
  authMiddleware,
  createPayPalOrder
);

router.post(
  "/capture-order",
  authMiddleware,
  capturePayPalOrder
);

router.post(
  "/create-qr-payment",
  authMiddleware,
  createPayPalQrPayment
);

export default router;