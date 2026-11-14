import mongoose from "mongoose";

const dayScheduleSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      required: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    startTime: String,
    endTime: String,
    breakStart: String,
    breakEnd: String,

    slotDuration: {
      type: Number,
      default: 30,
    },
  },
  { _id: false }
);

const weeklyScheduleSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      unique: true,
    },

    schedule: [dayScheduleSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "WeeklySchedule",
  weeklyScheduleSchema
);