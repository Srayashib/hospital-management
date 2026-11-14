import mongoose from "mongoose";

const hospitalSettingsSchema = new mongoose.Schema(
  {
    // ==========================================
    // HOSPITAL INFORMATION
    // ==========================================

    hospitalName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    emergencyPhone: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    zipCode: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      required: true,
      trim: true,
    },
    workingHours: {
      monday: {
        enabled: {
          type: Boolean,
          default: true,
        },
        start: {
          type: String,
          default: "09:00",
        },
        end: {
          type: String,
          default: "18:00",
        },
      },

      tuesday: {
        enabled: {
          type: Boolean,
          default: true,
        },
        start: {
          type: String,
          default: "09:00",
        },
        end: {
          type: String,
          default: "18:00",
        },
      },

      wednesday: {
        enabled: {
          type: Boolean,
          default: true,
        },
        start: {
          type: String,
          default: "09:00",
        },
        end: {
          type: String,
          default: "18:00",
        },
      },

      thursday: {
        enabled: {
          type: Boolean,
          default: true,
        },
        start: {
          type: String,
          default: "09:00",
        },
        end: {
          type: String,
          default: "18:00",
        },
      },

      friday: {
        enabled: {
          type: Boolean,
          default: true,
        },
        start: {
          type: String,
          default: "09:00",
        },
        end: {
          type: String,
          default: "18:00",
        },
      },

      saturday: {
        enabled: {
          type: Boolean,
          default: true,
        },
        start: {
          type: String,
          default: "10:00",
        },
        end: {
          type: String,
          default: "14:00",
        },
      },

      sunday: {
        enabled: {
          type: Boolean,
          default: false,
        },
        start: {
          type: String,
          default: "09:00",
        },
        end: {
          type: String,
          default: "18:00",
        },
      },
    },

    // ==========================================
// APPOINTMENT SETTINGS
// ==========================================

appointmentSettings: {

  appointmentDuration: {
    type: Number,
    default: 30,
  },

  advanceBookingDays: {
    type: Number,
    default: 30,
  },

  cancellationHours: {
    type: Number,
    default: 24,
  },

  allowSameDay: {
    type: Boolean,
    default: true,
  },

  allowCancellation: {
    type: Boolean,
    default: true,
  },

},
appointmentSettings: {
      appointmentDuration: {
        type: String,
        default: "30",
      },

      advanceBookingDays: {
        type: String,
        default: "30",
      },

      cancellationHours: {
        type: String,
        default: "24",
      },

      allowSameDay: {
        type: Boolean,
        default: true,
      },

      allowCancellation: {
        type: Boolean,
        default: true,
      },
    },

    // ==========================================
    // SYSTEM SETTINGS
    // ==========================================

    systemSettings: {
      currency: {
        type: String,
        default: "USD",
      },

      timezone: {
        type: String,
        default: "America/New_York",
      },

      dateFormat: {
        type: String,
        default: "MM/DD/YYYY",
      },

      language: {
        type: String,
        default: "English",
      },
    },

  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "HospitalSettings",
  hospitalSettingsSchema
);

    // ==========================================
    // FUTURE SETTINGS
    // ==========================================
    // We will add:
    // Working Hours
    // Appointment Settings
    // Notification Settings
    // Security
    // System Settings
    // later.
