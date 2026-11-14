import Appointment from "../models/Appointment.js";

// =====================================================
// CHECK RECEPTIONIST
// =====================================================

const checkReceptionist = (req, res) => {
  if (req.user?.role !== "receptionist") {
    res.status(403).json({
      success: false,
      message: "Receptionist access required.",
    });

    return false;
  }

  return true;
};

// =====================================================
// GET ALL COMPLETED BUT UNPAID APPOINTMENTS
// =====================================================

export const getPendingPayments = async (req, res) => {
  try {
    if (!checkReceptionist(req, res)) return;

    const appointments = await Appointment.find({
      status: "Completed",
      paymentStatus: {
        $ne: "Paid",
      },
    })
      .populate(
        "patient",
        "name email phone"
      )
      .populate(
        "doctor",
        "name department qualification"
      )
      .sort({
        date: -1,
        startTime: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error(
      "Get pending payments error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch pending payments.",
      error: error.message,
    });
  }
};

// =====================================================
// MARK QR / MANUAL PAYMENT AS PAID
// =====================================================

export const markPaymentAsPaid = async (req, res) => {
  try {
    if (!checkReceptionist(req, res)) return;

    const { appointmentId } = req.params;

    const {
      paymentMethod,
      paymentTransactionId,
      paymentAmount,
    } = req.body;

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
          "Payment can only be processed for a completed appointment.",
      });
    }

    if (appointment.paymentStatus === "Paid") {
      return res.status(400).json({
        success: false,
        message: "This appointment is already paid.",
      });
    }

    const amount =
      Number(paymentAmount) ||
      Number(appointment.fee) ||
      0;

    appointment.paymentStatus = "Paid";

    appointment.paymentMethod =
      paymentMethod || "QR";

    appointment.paymentAmount = amount;

    appointment.paymentTransactionId =
      paymentTransactionId || "";

    appointment.paidAt = new Date();

    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Payment recorded successfully.",
      appointment,
    });
  } catch (error) {
    console.error(
      "Mark payment as paid error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to record payment.",
      error: error.message,
    });
  }
};

