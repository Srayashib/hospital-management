import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
  {
    /* =========================================
       PATIENT
    ========================================= */

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },


    /* =========================================
       DOCTOR
    ========================================= */

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },


    /* =========================================
       APPOINTMENT
    ========================================= */

    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true,
    },


    /* =========================================
       DIAGNOSIS
    ========================================= */

    diagnosis: {
      type: String,
      trim: true,
      default: "",
    },


    /* =========================================
       CLINICAL FINDINGS
    ========================================= */

    clinicalFindings: {
      type: String,
      trim: true,
      default: "",
    },


    /* =========================================
       BLOOD / LAB TEST
    ========================================= */

    bloodTest: {
      name: {
        type: String,
        trim: true,
        default: "",
      },

      result: {
        type: String,
        trim: true,
        default: "",
      },
    },


    /* =========================================
       PRESCRIPTIONS
    ========================================= */

    prescriptions: [
      {
        medicineName: {
          type: String,
          trim: true,
          default: "",
        },

        dosage: {
          type: String,
          trim: true,
          default: "",
        },

        frequency: {
          type: String,
          trim: true,
          default: "",
        },

        duration: {
          type: String,
          trim: true,
          default: "",
        },

        instructions: {
          type: String,
          trim: true,
          default: "",
        },
      },
    ],


    /* =========================================
       TREATMENT NOTES
    ========================================= */

    treatmentNotes: {
      type: String,
      trim: true,
      default: "",
    },


    /* =========================================
       ADDITIONAL REMARKS
    ========================================= */

    remarks: {
      type: String,
      trim: true,
      default: "",
    },


    /* =========================================
       FOLLOW UP
    ========================================= */

    followUp: {
      required: {
        type: Boolean,
        default: false,
      },

      date: {
        type: Date,
        default: null,
      },
    },


    /* =========================================
       DOCUMENTS
    ========================================= */

    documents: {

  prescription: {

    path: {
      type: String,
      default: "",
    },

    originalName: {
      type: String,
      default: "",
    },

    mimeType: {
      type: String,
      default: "",
    },

    size: {
      type: Number,
      default: 0,
    },

  },


  labReport: {

    path: {
      type: String,
      default: "",
    },

    originalName: {
      type: String,
      default: "",
    },

    mimeType: {
      type: String,
      default: "",
    },

    size: {
      type: Number,
      default: 0,
    },

  },


  otherMedicalDocument: {

    path: {
      type: String,
      default: "",
    },

    originalName: {
      type: String,
      default: "",
    },

    mimeType: {
      type: String,
      default: "",
    },

    size: {
      type: Number,
      default: 0,
    },

  },

},
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "MedicalRecord",
  medicalRecordSchema
);