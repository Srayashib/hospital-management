import mongoose from "mongoose";

import Slot from "../models/Slot.js";
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Department from "../models/Department.js";
// export const bookAppointment = async (req, res) => {

//   try {

//     const patientId = req.user.id;

//     const {
//       slotId,
//       reason,
//       notes,
//     } = req.body;


//     if (!slotId || !reason) {

//       return res.status(400).json({

//         success: false,

//         message:
//           "Slot and appointment reason are required.",

//       });

//     }


//     const patient = await User.findById(
//       patientId
//     );

//     if (!patient) {

//       return res.status(404).json({

//         success: false,

//         message: "Patient not found.",

//       });

//     }


//     const slot = await Slot.findOneAndUpdate(

//       {
//         _id: slotId,

//         status: "Available",
//       },

//       {
//         $set: {
//           status: "Booked",
//         },
//       },

//       {
//         new: true,
//       }

//     );


//     if (!slot) {

//       return res.status(409).json({

//         success: false,

//         message:
//           "This slot has already been booked. Please select another slot.",

//       });

//     }


//     try {

//       const appointment =
//         await Appointment.create({

//           patient: patientId,

//           doctor: slot.doctor,

//           slot: slot._id,

//           date: slot.date,

//           day: slot.day,

//           startTime: slot.startTime,

//           endTime: slot.endTime,

//           reason,

//           notes: notes || "",

//           status: "Pending",

//         });



//       await Slot.findByIdAndUpdate(

//         slot._id,

//         {
//           appointment: appointment._id,
//         }

//       );


//       return res.status(201).json({

//         success: true,

//         message:
//           "Appointment booked successfully.",

//         appointment,

//       });


//     } catch (appointmentError) {

//       await Slot.findByIdAndUpdate(

//         slot._id,

//         {
//           status: "Available",
//           appointment: null,
//         }

//       );

//       throw appointmentError;

//     }


//   } catch (error) {

//     console.error(
//       "Book appointment error:",
//       error
//     );

//     return res.status(500).json({

//       success: false,

//       message:
//         "Failed to book appointment.",

//       error: error.message,

//     });

//   }

// };
// =====================================================
// GET MY APPOINTMENTS
// GET /api/appointments/my
// =====================================================
export const bookAppointment = async (req, res) => {
  try {

    const patientId = req.user.id;

    const {
      slotId,
      reason,
      notes,
    } = req.body;


    // ==========================================
    // VALIDATION
    // ==========================================

    if (!slotId || !reason?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Slot and appointment reason are required.",
      });
    }



    const patient = await User.findById(patientId);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }


    // ==========================================
    // GET DOCTOR + FEE
    // ==========================================

    const slot = await Slot.findOne({
      _id: slotId,
      status: "Available",
    });

    if (!slot) {
      return res.status(409).json({
        success: false,
        message:
          "This slot has already been booked. Please select another slot.",
      });
    }


    const doctor = await Doctor.findById(slot.doctor);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }


    const doctorFee = Number(doctor.fee || 0);


    // ==========================================
    // ATOMICALLY BOOK SLOT
    // ==========================================

    const bookedSlot = await Slot.findOneAndUpdate(
      {
        _id: slotId,
        status: "Available",
      },
      {
        $set: {
          status: "Booked",
        },
      },
      {
        new: true,
      }
    );


    if (!bookedSlot) {
      return res.status(409).json({
        success: false,
        message:
          "This slot has already been booked. Please select another slot.",
      });
    }


    // ==========================================
    // CREATE APPOINTMENT
    // ==========================================

    try {

      const appointment = await Appointment.create({

        patient: patientId,

        doctor: bookedSlot.doctor,

        slot: bookedSlot._id,

        date: bookedSlot.date,

        day: bookedSlot.day,

        startTime: bookedSlot.startTime,

        endTime: bookedSlot.endTime,

        // =====================================
        // SAVE DOCTOR FEE
        // =====================================

        fee: doctorFee,

        reason: reason.trim(),

        notes: notes || "",

        status: "Pending",

      });


      // ==========================================
      // CONNECT APPOINTMENT TO SLOT
      // ==========================================

      await Slot.findByIdAndUpdate(
        bookedSlot._id,
        {
          appointment: appointment._id,
        }
      );


      // ==========================================
      // RESPONSE
      // ==========================================

      return res.status(201).json({

        success: true,

        message:
          "Appointment booked successfully.",

        appointment,

        fee: doctorFee,

      });


    } catch (appointmentError) {

      // ==========================================
      // ROLLBACK SLOT
      // ==========================================

      await Slot.findByIdAndUpdate(
        bookedSlot._id,
        {
          status: "Available",
          appointment: null,
        }
      );

      throw appointmentError;
    }


  } catch (error) {

    console.error(
      "Book appointment error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to book appointment.",

      error: error.message,

    });

  }
};
// export const getMyAppointments = async (req, res) => {
//   try {

//     const patientId = req.user.id;

//     const appointments = await Appointment.find({
//       patient: patientId,
//     })
//       .populate(
//         "doctor",
//         "name email phone department qualification experience image"
//       )
//       .populate(
//         "slot",
//         "date day startTime endTime status"
//       )
//       .sort({
//         date: -1,
//         startTime: -1,
//       });

//     return res.status(200).json({
//       success: true,
//       appointments,
//     });

//   } catch (error) {

//     console.error(
//       "Get my appointments error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch appointments",
//       error: error.message,
//     });

//   }
// };
export const getMyAppointments = async (req, res) => {
  try {

    const patientId = req.user.id || req.user._id;

    const appointments = await Appointment.find({
      patient: patientId,
    })
      .populate(
        "doctor",
        "name email phone department qualification experience image"
      )
      .populate(
        "slot",
        "date day startTime endTime status"
      )
      .sort({
        date: -1,
        startTime: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      appointments,
    });

  } catch (error) {

    console.error(
      "Get my appointments error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
      error: error.message,
    });

  }
};
export const receptionistBookAppointment = async (req, res) => {
  try {

    const {
      patientId,
      slotId,
      reason,
      notes,
    } = req.body;


    // ==========================================
    // VALIDATION
    // ==========================================

    if (!patientId || !slotId || !reason?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Patient, slot and appointment reason are required.",
      });
    }


    // ==========================================
    // CHECK PATIENT
    // ==========================================

    const patient = await User.findById(patientId);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }


    // ==========================================
    // GET SLOT
    // ==========================================

    const slot = await Slot.findById(slotId);

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Appointment slot not found.",
      });
    }


    // ==========================================
    // CHECK SLOT STATUS
    // ==========================================

    if (slot.status !== "Available") {
      return res.status(409).json({
        success: false,
        message:
          "This slot has already been booked. Please select another slot.",
      });
    }


    // ==========================================
    // GET DOCTOR
    // ==========================================

    const doctor = await Doctor.findById(slot.doctor);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }


    const doctorFee = Number(doctor.fee || 0);


    // ==========================================
    // ATOMICALLY BOOK SLOT
    // ==========================================

    const bookedSlot = await Slot.findOneAndUpdate(
      {
        _id: slotId,
        status: "Available",
      },
      {
        $set: {
          status: "Booked",
        },
      },
      {
        new: true,
      }
    );


    if (!bookedSlot) {
      return res.status(409).json({
        success: false,
        message:
          "This slot has already been booked. Please select another slot.",
      });
    }


    // ==========================================
    // CREATE APPOINTMENT
    // ==========================================

    try {

      const appointment =
        await Appointment.create({

          patient: patientId,

          doctor: bookedSlot.doctor,

          slot: bookedSlot._id,

          date: bookedSlot.date,

          day: bookedSlot.day,

          startTime: bookedSlot.startTime,

          endTime: bookedSlot.endTime,

          fee: doctorFee,

          reason: reason.trim(),

          notes: notes || "",

          status: "Pending",

        });


      // ==========================================
      // CONNECT APPOINTMENT TO SLOT
      // ==========================================

      await Slot.findByIdAndUpdate(
        bookedSlot._id,
        {
          appointment: appointment._id,
        }
      );


      // ==========================================
      // RESPONSE
      // ==========================================

      return res.status(201).json({

        success: true,

        message:
          "Appointment booked successfully.",

        appointment,

        fee: doctorFee,

      });

    } catch (appointmentError) {

      // ==========================================
      // ROLLBACK SLOT
      // ==========================================

      await Slot.findByIdAndUpdate(
        bookedSlot._id,
        {
          status: "Available",
          appointment: null,
        }
      );

      throw appointmentError;
    }


  } catch (error) {

    console.error(
      "Receptionist book appointment error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to book appointment.",

      error: error.message,

    });

  }
};


// export const getReceptionistAppointmentSummary = async (req, res) => {
//   try {

//     const totalAppointments = await Appointment.countDocuments();

//     const today = new Date();

//     const startOfToday = new Date(today);
//     startOfToday.setHours(0, 0, 0, 0);

//     const endOfToday = new Date(today);
//     endOfToday.setHours(23, 59, 59, 999);

//     const todayAppointments =
//       await Appointment.countDocuments({
//         date: {
//           $gte: startOfToday,
//           $lte: endOfToday,
//         },
//       });

//     const pendingAppointments =
//       await Appointment.countDocuments({
//         status: "Pending",
//       });

//     return res.status(200).json({
//       success: true,

//       summary: {
//         totalAppointments,
//         todayAppointments,
//         pendingAppointments,
//       },
//     });

//   } catch (error) {

//     console.error(
//       "Receptionist appointment summary error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch appointment summary.",
//       error: error.message,
//     });
//   }
// };


// export const getReceptionistAppointments = async (req, res) => {
//   try {

//     const { filter = "today" } = req.query;

//     let query = {};

//     if (filter === "today") {

//       const today = new Date();

//       const startOfToday = new Date(today);
//       startOfToday.setHours(0, 0, 0, 0);

//       const endOfToday = new Date(today);
//       endOfToday.setHours(23, 59, 59, 999);

//       query.date = {
//         $gte: startOfToday,
//         $lte: endOfToday,
//       };

//     } else if (filter === "pending") {

//       query.status = "Pending";

//     } else if (filter === "all") {

//       query = {};

//     } else {

//       return res.status(400).json({
//         success: false,
//         message: "Invalid appointment filter.",
//       });

//     }

//     const appointments = await Appointment.find(query)
//       .populate(
//         "patient",
//         "name email phone"
//       )
//       .populate(
//         "doctor",
//         "name email department image"
//       )
//       .populate(
//         "slot",
//         "date day startTime endTime status"
//       )
//       .sort({
//         date: 1,
//         startTime: 1,
//       });

//     return res.status(200).json({
//       success: true,
//       filter,
//       count: appointments.length,
//       appointments,
//     });

//   } catch (error) {

//     console.error(
//       "Get receptionist appointments error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch appointments.",
//       error: error.message,
//     });
//   }
// };

// export const getReceptionistAppointments = async (req, res) => {
//   try {
//     const { filter = "today", department = "all" } = req.query;

//     let query = {};

//     if (filter === "today") {
//       const today = new Date();

//       const startOfToday = new Date(today);
//       startOfToday.setHours(0, 0, 0, 0);

//       const endOfToday = new Date(today);
//       endOfToday.setHours(23, 59, 59, 999);

//       query.date = {
//         $gte: startOfToday,
//         $lte: endOfToday,
//       };
//     }

//     else if (filter === "pending") {
//       query.status = "Pending";
//     }

//     else if (filter === "all") {
//       query = {};
//     }

//     else {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid appointment filter.",
//       });
//     }

//     const baseAppointments = await Appointment.find(query)
//       .populate("patient", "name email phone")
//       .populate("doctor", "name email department image")
//       .populate("slot", "date day startTime endTime status")
//       .sort({
//         date: 1,
//         startTime: 1,
//       });

//     const departmentMap = {};

//     baseAppointments.forEach((appointment) => {
//       const departmentName =
//         appointment.doctor?.department || "Other";

//       departmentMap[departmentName] =
//         (departmentMap[departmentName] || 0) + 1;
//     });

//     const departmentCounts = Object.entries(
//       departmentMap
//     ).map(([name, count]) => ({
//       name,
//       count,
//     }));

//     let appointments = baseAppointments;

//     if (department !== "all") {
//       appointments = baseAppointments.filter(
//         (appointment) =>
//           appointment.doctor?.department === department
//       );
//     }

//     return res.status(200).json({
//       success: true,

//       filter,

//       department,

//       count: appointments.length,

//       appointments,

//       departmentCounts,
//     });

//   } catch (error) {

//     console.error(
//       "Get receptionist appointments error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch appointments.",
//       error: error.message,
//     });
//   }
// };


// export const getReceptionistAppointments = async (req, res) => {
//   try {
//     const {
//       filter = "today",
//       department = "all",
//     } = req.query;

//     // =====================================================
//     // BUILD APPOINTMENT FILTER
//     // =====================================================

//     let query = {};

//     if (filter === "today") {
//       const today = new Date();

//       const startOfToday = new Date(today);
//       startOfToday.setHours(0, 0, 0, 0);

//       const endOfToday = new Date(today);
//       endOfToday.setHours(23, 59, 59, 999);

//       query.date = {
//         $gte: startOfToday,
//         $lte: endOfToday,
//       };
//     }

//     else if (filter === "pending") {
//       query.status = "Pending";
//     }

//     else if (filter === "all") {
//       query = {};
//     }

//     else {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid appointment filter.",
//       });
//     }



//     const departments = await Doctor.distinct(
//       "department"
//     );


//     // =====================================================
//     // GET APPOINTMENTS
//     // =====================================================

//     const baseAppointments =
//       await Appointment.find(query)
//         .populate(
//           "patient",
//           "name email phone"
//         )
//         .populate(
//           "doctor",
//           "name email department image"
//         )
//         .populate(
//           "slot",
//           "date day startTime endTime status"
//         )
//         .sort({
//           date: 1,
//           startTime: 1,
//         });


//     // =====================================================
//     // CREATE DEPARTMENT COUNT MAP
//     // =====================================================

//     const departmentMap = {};

//     departments.forEach((departmentName) => {
//       if (departmentName) {
//         departmentMap[departmentName] = 0;
//       }
//     });


//     // =====================================================
//     // COUNT APPOINTMENTS BY DEPARTMENT
//     // =====================================================

//     baseAppointments.forEach((appointment) => {

//       const departmentName =
//         appointment.doctor?.department;

//       if (!departmentName) {
//         return;
//       }

//       departmentMap[departmentName] =
//         (departmentMap[departmentName] || 0) + 1;

//     });


//     // =====================================================
//     // DEPARTMENT COUNTS
//     // =====================================================

//     const departmentCounts =
//       Object.entries(departmentMap)
//         .sort(([a], [b]) =>
//           a.localeCompare(b)
//         )
//         .map(([name, count]) => ({
//           name,
//           count,
//         }));


//     // =====================================================
//     // FILTER APPOINTMENTS BY DEPARTMENT
//     // =====================================================

//     let appointments = baseAppointments;

//     if (
//       department &&
//       department !== "all"
//     ) {

//       appointments =
//         baseAppointments.filter(
//           (appointment) =>
//             appointment.doctor?.department ===
//             department
//         );

//     }


//     // =====================================================
//     // RESPONSE
//     // =====================================================

//     return res.status(200).json({

//       success: true,

//       filter,

//       department,

//       count: appointments.length,

//       appointments,

//       departmentCounts,

//     });

//   } catch (error) {

//     console.error(
//       "Get receptionist appointments error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to fetch appointments.",
//       error: error.message,
//     });

//   }
// };
export const getReceptionistAppointments = async (req, res) => {
  try {
    const {
      filter = "today",
      department = "all",
    } = req.query;

    // =====================================================
    // BUILD APPOINTMENT FILTER
    // =====================================================

    let query = {};

    if (filter === "today") {
      const today = new Date();

      const startOfToday = new Date(today);
      startOfToday.setHours(0, 0, 0, 0);

      const endOfToday = new Date(today);
      endOfToday.setHours(23, 59, 59, 999);

      query.date = {
        $gte: startOfToday,
        $lte: endOfToday,
      };
    }

    else if (filter === "pending") {
      query.status = "Pending";
    }

    else if (filter === "cancelled") {
      query.status = "Cancelled";
    }

    else if (filter === "all") {
      query = {};
    }

    else {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment filter.",
      });
    }


    // =====================================================
    // GET ALL ACTIVE DEPARTMENTS
    // =====================================================

    const departments = await Department.find({
      status: "Active",
    })
      .select("name")
      .sort({ name: 1 })
      .lean();


    // =====================================================
    // GET APPOINTMENTS
    // =====================================================

    const baseAppointments =
      await Appointment.find(query)
        .populate(
          "patient",
          "name email phone"
        )
        .populate(
          "doctor",
          "name email department image"
        )
        .populate(
          "slot",
          "date day startTime endTime status"
        )
        .sort({
          date: 1,
          startTime: 1,
        });


    // =====================================================
    // CREATE DEPARTMENT COUNT MAP
    // IMPORTANT:
    // Start every department with 0
    // =====================================================

    const departmentMap = {};

    departments.forEach((department) => {

      if (department.name) {
        departmentMap[department.name] = 0;
      }

    });


    // =====================================================
    // COUNT APPOINTMENTS BY DEPARTMENT
    // =====================================================

    baseAppointments.forEach((appointment) => {

      const departmentName =
        appointment.doctor?.department;

      if (!departmentName) {
        return;
      }

      // Only count departments that exist
      // in the Department collection

      if (
        Object.prototype.hasOwnProperty.call(
          departmentMap,
          departmentName
        )
      ) {

        departmentMap[departmentName] += 1;

      }

    });


    // =====================================================
    // DEPARTMENT COUNTS
    // =====================================================

    const departmentCounts =
      Object.entries(departmentMap)
        .map(([name, count]) => ({
          name,
          count,
        }));


    // =====================================================
    // FILTER APPOINTMENTS BY DEPARTMENT
    // =====================================================

    let appointments = baseAppointments;

    if (
      department &&
      department !== "all"
    ) {

      appointments =
        baseAppointments.filter(
          (appointment) =>
            appointment.doctor?.department ===
            department
        );

    }


    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({

      success: true,

      filter,

      department,

      count: appointments.length,

      appointments,

      departmentCounts,

    });

  } catch (error) {

    console.error(
      "Get receptionist appointments error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch appointments.",

      error: error.message,

    });

  }
};
export const getReceptionistAppointmentSummary = async (
  req,
  res
) => {

  try {

    const {
      department = "all",
    } = req.query;


    // =====================================================
    // DEPARTMENT FILTER
    // =====================================================

    let appointmentFilter = {};


    if (
      department &&
      department !== "all"
    ) {

      const doctors =
        await Doctor.find(
          {
            department: department,
          },
          "_id"
        );

      const doctorIds =
        doctors.map(
          (doctor) => doctor._id
        );


      appointmentFilter.doctor = {
        $in: doctorIds,
      };

    }


    // =====================================================
    // TOTAL
    // =====================================================

    const totalAppointments =
      await Appointment.countDocuments(
        appointmentFilter
      );


    // =====================================================
    // TODAY
    // =====================================================

    const today = new Date();

    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);


    const todayAppointments =
      await Appointment.countDocuments({
        ...appointmentFilter,

        date: {
          $gte: startOfToday,
          $lte: endOfToday,
        },

      });


    // =====================================================
    // PENDING
    // =====================================================

    const pendingAppointments =
      await Appointment.countDocuments({
        ...appointmentFilter,

        status: "Pending",

      });


    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({

      success: true,

      department,

      summary: {

        totalAppointments,

        todayAppointments,

        pendingAppointments,

      },

    });

  } catch (error) {

    console.error(
      "Receptionist appointment summary error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch appointment summary.",

      error: error.message,

    });

  }

};

// =====================================================
// UPDATE APPOINTMENT STATUS
// =====================================================

export const updateAppointmentStatus = async (req, res) => {
  try {

    const { id } = req.params;
    const { status } = req.body;

    // =====================================================
    // ALLOWED STATUSES
    // =====================================================

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Checked In",
      "Completed",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment status.",
      });
    }


    // =====================================================
    // FIND APPOINTMENT
    // =====================================================

    const appointment =
      await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }


    // =====================================================
    // UPDATE STATUS
    // =====================================================

    appointment.status = status;

    await appointment.save();


    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({

      success: true,

      message:
        `Appointment status updated to ${status}.`,

      appointment,

    });

  } catch (error) {

    console.error(
      "Update appointment status error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to update appointment status.",

      error: error.message,

    });

  }
};



export const deleteCancelledAppointment = async (req, res) => {
  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {

      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID.",
      });

    }


    const appointment =
      await Appointment.findById(id);

    if (!appointment) {

      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });

    }

    if (
      appointment.status?.toLowerCase() !==
      "cancelled"
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Only cancelled appointments can be deleted.",
      });

    }


    if (appointment.slot) {

      await Slot.findByIdAndUpdate(
        appointment.slot,
        {
          $set: {
            appointment: null,
            status: "Available",
          },
        }
      );

    }


    await Appointment.findByIdAndDelete(id);


    return res.status(200).json({

      success: true,

      message:
        "Cancelled appointment deleted successfully.",

    });

  } catch (error) {

    console.error(
      "Delete cancelled appointment error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to delete cancelled appointment.",

      error: error.message,

    });

  }
};


// =====================================================
// GET PATIENT COMPLETED APPOINTMENT PAYMENTS
// =====================================================

export const getPatientCompletedPayments = async (req, res) => {
  try {
    if (req.user?.role !== "patient") {
      return res.status(403).json({
        success: false,
        message: "Patient access required.",
      });
    }

    const appointments = await Appointment.find({
      patient: req.user.id,
      status: "Completed",
    })
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
      "Get patient completed payments error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch patient payments.",
      error: error.message,
    });
  }
};