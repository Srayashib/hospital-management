import mongoose from "mongoose";

const patientProfileSchema = new mongoose.Schema(
  {
    /* =========================================
       USER REFERENCE
    ========================================= */

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },


    /* =========================================
       PERSONAL INFORMATION
    ========================================= */

    dateOfBirth: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
    },
    bloodGroup: {
  type: String,
  enum: [
    "",
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


    /* =========================================
       ADDRESS
    ========================================= */

    address: {
      street: {
        type: String,
        trim: true,
        default: "",
      },

      city: {
        type: String,
        trim: true,
        default: "",
      },

      state: {
        type: String,
        trim: true,
        default: "",
      },

      zipCode: {
        type: String,
        trim: true,
        default: "",
      },

      country: {
        type: String,
        trim: true,
        default: "USA",
      },
    },


    /* =========================================
       NOTIFICATION PREFERENCES
    ========================================= */

    notificationPreferences: {
      appointmentReminders: {
        type: Boolean,
        default: true,
      },

      emailNotifications: {
        type: Boolean,
        default: true,
      },

      prescriptionUpdates: {
        type: Boolean,
        default: true,
      },
    },


    /* =========================================
       PRIVACY SETTINGS
    ========================================= */

    privacySettings: {
      medicalRecordPrivacy: {
        type: Boolean,
        default: true,
      },

      dataSharing: {
        type: Boolean,
        default: false,
      },
    },
    /* =========================================
   LATEST VITALS
========================================= */

latestVitals: {

  bloodPressure: {
    type: String,
    trim: true,
    default: "",
  },

  heartRate: {
    type: Number,
    default: null,
  },

  weight: {
    type: Number,
    default: null,
  },

  bloodSugar: {
    type: Number,
    default: null,
  },

  updatedAt: {
    type: Date,
    default: null,
  },

},


    /* =========================================
       APPOINTMENT PREFERENCES
    ========================================= */

    appointmentPreferences: {
      preferredDepartment: {
        type: String,
        default: "",
        trim: true,
      },

      reminderTime: {
        type: Number,
        default: 24,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "PatientProfile",
  patientProfileSchema
);