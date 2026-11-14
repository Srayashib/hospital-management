import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: "leave",
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    leave: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Leave",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Automatically delete notification after 2 days
notificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 2 * 24 * 60 * 60 }
);

export default mongoose.model(
  "Notification",
  notificationSchema
);