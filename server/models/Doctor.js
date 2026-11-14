import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    dob: Date,

    bloodGroup: String,

    address: String,

    department: {
      type: String,
      required: true,
    },

    qualification: {
      type: String,
      required: true,
    },

    experience: Number,

    fee: Number,

    license: {
      type: String,
      required: true,
      unique: true,
    },

    joiningDate: Date,

    weeklyHolidays: [
    {
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
    },
  ],

    password: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      default: "Active",
    },

    role: {
      type: String,
      default: "doctor",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Doctor", doctorSchema);