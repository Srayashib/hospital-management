import mongoose from "mongoose";

const receptionistSchema = new mongoose.Schema(
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
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    bloodGroup: {
      type: String,
      enum: [
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-",
      ],
      default: "",
    },

    address: {
      type: String,
      required: true,
    },

    joiningDate: {
      type: Date,
      required: true,
    },

    weeklyHolidays: {
      type: [String],
      default: [],
    },

    password: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    image: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      default: "receptionist",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Receptionist",
  receptionistSchema
);