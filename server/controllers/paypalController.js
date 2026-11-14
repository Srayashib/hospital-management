import {
  OrdersController,
  CheckoutPaymentIntent,
  ApiError,
} from "@paypal/paypal-server-sdk";

import paypalClient from "../config/paypal.js";
import Appointment from "../models/appointment.js";

const ordersController = new OrdersController(
  paypalClient
);

// =====================================================
// CREATE PAYPAL ORDER
// =====================================================

export const createPayPalOrder = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    console.log("Creating PayPal order for:", appointmentId);

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID is required.",
      });
    }

    const appointment =
      await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    console.log("Appointment found:", {
      id: appointment._id.toString(),
      status: appointment.status,
      fee: appointment.fee,
      paymentStatus: appointment.paymentStatus,
    });

    if (appointment.status !== "Completed") {
      return res.status(400).json({
        success: false,
        message:
          "Payment is only available for completed appointments.",
      });
    }

    if (appointment.paymentStatus === "Paid") {
      return res.status(400).json({
        success: false,
        message: "This appointment is already paid.",
      });
    }

    const amount = Number(appointment.fee || 0);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment fee.",
      });
    }

    const payload = {
      body: {
        intent: CheckoutPaymentIntent.Capture,

        purchaseUnits: [
          {
            referenceId:
              appointment._id.toString(),

            description:
              "Medicare hospital appointment",

            amount: {
              currencyCode:
                process.env.PAYPAL_CURRENCY || "USD",

              value: amount.toFixed(2),
            },
          },
        ],
      },

      prefer: "return=minimal",
    };

    console.log(
      "Sending PayPal order request:",
      payload.body
    );

    const { result } =
      await ordersController.createOrder(payload);

    console.log(
      "PayPal create order result:",
      result
    );

    if (!result?.id) {
      throw new Error(
        "PayPal did not return an order ID."
      );
    }

    appointment.paymentOrderId = result.id;

    await appointment.save();

    return res.status(200).json({
      success: true,
      orderId: result.id,
    });
  } catch (error) {
    console.error(
      "Create PayPal order ERROR:"
    );

    if (error instanceof ApiError) {
      console.error(
        "PayPal status:",
        error.statusCode
      );

      console.error(
        "PayPal body:",
        error.body
      );
    } else {
      console.error(error);
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create PayPal order.",
      error:
        error?.body?.message ||
        error?.message ||
        "Unknown PayPal error.",
    });
  }
};

// =====================================================
// CAPTURE PAYPAL ORDER
// =====================================================

// export const capturePayPalOrder = async (
//   req,
//   res
// ) => {
//   try {
//     const {
//       appointmentId,
//       orderId,
//     } = req.body;

//     if (!appointmentId || !orderId) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Appointment ID and PayPal order ID are required.",
//       });
//     }

//     const appointment =
//       await Appointment.findById(appointmentId);

//     if (!appointment) {
//       return res.status(404).json({
//         success: false,
//         message: "Appointment not found.",
//       });
//     }

//     if (
//       appointment.paymentOrderId &&
//       appointment.paymentOrderId !== orderId
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "PayPal order does not belong to this appointment.",
//       });
//     }

//     const { result } =
//       await ordersController.captureOrder({
//         id: orderId,
//         prefer: "return=representation",
//       });

//     console.log(
//       "PayPal capture result:",
//       result
//     );

//     const capture =
//       result?.purchaseUnits?.[0]
//         ?.payments?.captures?.[0];

//     if (
//       result?.status !== "COMPLETED" ||
//       capture?.status !== "COMPLETED"
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "PayPal payment was not completed.",
//         paypalStatus: result?.status,
//       });
//     }

//     appointment.paymentStatus = "Paid";
//     appointment.paymentMethod = "PayPal";

//     appointment.paymentAmount = Number(
//       capture.amount?.value ||
//         appointment.fee ||
//         0
//     );

//     appointment.paymentOrderId =
//       orderId;

//     appointment.paymentTransactionId =
//       capture.id || "";

//     appointment.paidAt = new Date();

//     await appointment.save();

//     return res.status(200).json({
//       success: true,
//       message:
//         "PayPal payment completed successfully.",

//       appointment,

//       paypal: {
//         orderId,
//         captureId: capture.id,
//         status: capture.status,
//         amount: capture.amount,
//       },
//     });
//   } catch (error) {
//     console.error(
//       "Capture PayPal order ERROR:"
//     );

//     if (error instanceof ApiError) {
//       console.error(
//         "PayPal status:",
//         error.statusCode
//       );

//       console.error(
//         "PayPal body:",
//         error.body
//       );
//     } else {
//       console.error(error);
//     }

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to capture PayPal payment.",
//       error:
//         error?.body?.message ||
//         error?.message ||
//         "Unknown PayPal error.",
//     });
//   }
// };


export const capturePayPalOrder = async (req, res) => {
  try {
    const {
      appointmentId,
      orderId,
      paymentMethod,
    } = req.body;

    if (!appointmentId || !orderId) {
      return res.status(400).json({
        success: false,
        message:
          "Appointment ID and PayPal order ID are required.",
      });
    }

    if (
      paymentMethod &&
      !["PayPal", "Card"].includes(paymentMethod)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method.",
      });
    }

    const appointment =
      await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    if (appointment.status !== "Completed") {
      return res.status(400).json({
        success: false,
        message:
          "Payment is only available for completed appointments.",
      });
    }

    if (appointment.paymentStatus === "Paid") {
      return res.status(400).json({
        success: false,
        message: "This appointment is already paid.",
      });
    }

    if (
      appointment.paymentOrderId &&
      appointment.paymentOrderId !== orderId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "PayPal order does not belong to this appointment.",
      });
    }

    const { result } =
      await ordersController.captureOrder({
        id: orderId,
        prefer: "return=representation",
      });

    console.log(
      "PayPal capture result:",
      JSON.stringify(result, null, 2)
    );

    const capture =
      result?.purchaseUnits?.[0]
        ?.payments?.captures?.[0];

    if (
      result?.status !== "COMPLETED" ||
      capture?.status !== "COMPLETED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment was not completed.",
        paypalStatus: result?.status || null,
        captureStatus: capture?.status || null,
      });
    }

    // =====================================================
    // PAYMENT SUCCESS
    // =====================================================

    appointment.paymentStatus = "Paid";

    appointment.paymentMethod =
      paymentMethod || "PayPal";

    appointment.paymentAmount = Number(
      capture.amount?.value ||
        appointment.fee ||
        0
    );

    appointment.paymentOrderId = orderId;

    appointment.paymentTransactionId =
      capture.id || "";

    appointment.paidAt = new Date();

    await appointment.save();

    return res.status(200).json({
      success: true,

      message:
        "Payment completed successfully.",

      appointment,

      paypal: {
        orderId,
        captureId: capture.id,
        status: capture.status,
        amount: capture.amount,
      },
    });
  } catch (error) {
    console.error(
      "Capture payment ERROR:"
    );

    if (error instanceof ApiError) {
      console.error(
        "PayPal status:",
        error.statusCode
      );

      console.error(
        "PayPal body:",
        error.body
      );
    } else {
      console.error(error);
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to capture payment.",
      error:
        error?.body?.message ||
        error?.message ||
        "Unknown PayPal error.",
    });
  }
};