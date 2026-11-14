import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { getPendingPayments,markPaymentAsPaid } from '../controllers/receptionistPaymentController.js';

const router=express.Router();
router.get("/pending",authMiddleware,getPendingPayments);
router.get("/:appointmentId/pay",authMiddleware,markPaymentAsPaid);

export default router;