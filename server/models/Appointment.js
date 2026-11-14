import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
      unique: true,
    },

    date: {
      type: Date,
      required: true,
    },

    day: {
      type: String,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    fee: {
      type: Number,
      required: true,
      default: 0,
    },


    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Paid",
        "Failed",
        "Refunded",
      ],
      default: "Pending",
    },

    paymentMethod: {
      type: String,
      enum: [
        "",
        "QR",
        "Card",
        "PayPal",
        "Cash",
      ],
      default: "",
    },

    paymentAmount: {
      type: Number,
      default: 0,
    },

    paymentTransactionId: {
      type: String,
      default: "",
      trim: true,
    },

    paymentOrderId: {
      type: String,
      default: "",
      trim: true,
    },
    paymentQrLinkId: {
      type: String,
      default: "",
      trim: true,
    },

    paymentQrUrl: {
      type: String,
      default: "",
      trim: true,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Checked In",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Appointment =
  mongoose.models.Appointment ||
  mongoose.model("Appointment", appointmentSchema);

export default Appointment;