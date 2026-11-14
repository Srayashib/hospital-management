import mongoose from "mongoose";

// const slotSchema = new mongoose.Schema(
//   {
//     doctor: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Doctor",
//       required: true,
//     },

//     date: {
//       type: Date,
//       required: true,
//     },

//     day: {
//       type: String,
//       required: true,
//     },

//     startTime: {
//       type: String,
//       required: true,
//     },

//     endTime: {
//       type: String,
//       required: true,
//     },

//     status: {
//       type: String,
//       enum: ["Available", "Booked", "Blocked"],
//       default: "Available",
//     },

//     appointment: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Appointment",
//       default: null,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export default mongoose.model("Slot", slotSchema);


const slotSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
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

    status: {
      type: String,
      enum: [
        "Available",
        "Booked",
        "Blocked",
      ],
      default: "Available",
    },

    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


// =====================================================
// PREVENT DUPLICATE SLOT
// =====================================================

slotSchema.index(
  {
    doctor: 1,
    date: 1,
    startTime: 1,
  },
  {
    unique: true,
  }
);


export default mongoose.model(
  "Slot",
  slotSchema
);