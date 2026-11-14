import Slot from "../models/Slot.js";
import WeeklySchedule from "../models/WeeklySchedule.js";
import { generateSlots } from "../utils/generateSlots.js";
import Appointment from "../models/Appointment.js";

// export const getAvailableSlots = async (req, res) => {
//   try {

//     const doctorId = req.user.id;

//     const weekly = await WeeklySchedule.findOne({
//       doctor: doctorId,
//     });

//     if (!weekly) {
//       return res.status(404).json({
//         success:false,
//         message:"Weekly schedule not found",
//       });
//     }

//     // Always regenerate next 7 days
//     await generateSlots(
//       doctorId,
//       weekly.schedule
//     );

//     const slots = await Slot.find({
//       doctor: doctorId,
//     }).sort({
//       date:1,
//       startTime:1,
//     });

//     res.json({
//       success:true,
//       slots,
//     });

//   } catch(error){

//     console.log(error);

//     res.status(500).json({
//       success:false,
//       message:"Server Error",
//     });

//   }
// };

// export const getAvailableSlots = async (
//   req,
//   res
// ) => {

//   try {

//     const doctorId = req.user.id;


//     const slots = await Slot.find({

//       doctor: doctorId,

//       date: {
//         $gte: new Date(),
//       },

//     })
//       .sort({
//         date: 1,
//         startTime: 1,
//       });


//     return res.status(200).json({

//       success: true,

//       count: slots.length,

//       slots,

//     });


//   } catch (error) {

//     console.error(
//       "Get available slots error:",
//       error
//     );


//     return res.status(500).json({

//       success: false,

//       message:
//         "Unable to load slots.",

//       error: error.message,

//     });

//   }

// };

export const getAvailableSlots = async (req, res) => {

  try {

    const doctorId = req.user.id;


    // =====================================================
    // TODAY 00:00
    // =====================================================

    const today = new Date();

    const startOfToday = new Date(today);

    startOfToday.setHours(
      0,
      0,
      0,
      0
    );


    // =====================================================
    // GET TODAY + FUTURE SLOTS
    // =====================================================

    const slots = await Slot.find({

      doctor: doctorId,

      date: {
        $gte: startOfToday,
      },

    })
      .sort({
        date: 1,
        startTime: 1,
      });


    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({

      success: true,

      count: slots.length,

      slots,

    });


  } catch (error) {

    console.error(
      "Get available slots error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Unable to load slots.",

      error: error.message,

    });

  }

};
export const getSlotsByDate = async (req, res) => {

  try {

    const doctorId = req.user.id;

    const { date } = req.params;

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const slots = await Slot.find({
      doctor: doctorId,
      date: {
        $gte: start,
        $lte: end,
      },
    })
      .sort({
        startTime: 1,
      });

    const available = slots.filter(
      slot => slot.status === "Available"
    ).length;

    const booked = slots.filter(
      slot => slot.status === "Booked"
    ).length;

    res.status(200).json({

      success: true,

      date,

      totalSlots: slots.length,

      availableSlots: available,

      bookedSlots: booked,

      slots,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

};


// export const getSlotsByDoctorAndDate = async (req, res) => {
//   try {
//     const { doctorId, date } = req.params;

//     if (!doctorId || !date) {
//       return res.status(400).json({
//         success: false,
//         message: "Doctor and date are required.",
//       });
//     }

//     const selectedDate = new Date(date);

//     if (isNaN(selectedDate.getTime())) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid date.",
//       });
//     }

//     const startOfDay = new Date(selectedDate);
//     startOfDay.setHours(0, 0, 0, 0);

//     const endOfDay = new Date(selectedDate);
//     endOfDay.setHours(23, 59, 59, 999);

//     const slots = await Slot.find({
//       doctor: doctorId,
//       date: {
//         $gte: startOfDay,
//         $lte: endOfDay,
//       },
//     }).sort({
//       startTime: 1,
//     });

//     const slotIds = slots.map((slot) => slot._id);

//     const appointments = await Appointment.find({
//       slot: { $in: slotIds },
//       status: {
//         $in: ["Pending", "Confirmed", "Completed"],
//       },
//     }).select("slot status");

//     const appointmentMap = {};

//     appointments.forEach((appointment) => {
//       appointmentMap[appointment.slot.toString()] = appointment.status;
//     });

//     const formattedSlots = slots.map((slot) => {
//       const appointmentStatus = appointmentMap[slot._id.toString()];

//       return {
//         _id: slot._id,
//         doctor: slot.doctor,
//         date: slot.date,
//         day: slot.day,
//         startTime: slot.startTime,
//         endTime: slot.endTime,
//         slotStatus: slot.status,
//         appointmentStatus: appointmentStatus || null,
//         isAvailable:
//           !appointmentStatus &&
//           slot.status !== "Blocked",
//       };
//     });

//     return res.status(200).json({
//       success: true,
//       slots: formattedSlots,
//     });

//   } catch (error) {
//     console.error(
//       "Get slots by doctor and date error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch appointment slots.",
//       error: error.message,
//     });
//   }
// };
// =====================================================
// GET SLOTS BY DOCTOR AND DATE
// =====================================================

// export const getSlotsByDoctorAndDate = async (req, res) => {
//   try {

//     const { doctorId, date } = req.params;

//     if (!doctorId || !date) {
//       return res.status(400).json({
//         success: false,
//         message: "Doctor and date are required.",
//       });
//     }


//     // ==========================================
//     // VALIDATE DATE
//     // ==========================================

//     const selectedDate = new Date(`${date}T00:00:00`);

//     if (isNaN(selectedDate.getTime())) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid date.",
//       });
//     }


//     // ==========================================
//     // START / END OF DATE
//     // ==========================================

//     const startDate = new Date(`${date}T00:00:00`);

//     const endDate = new Date(`${date}T23:59:59.999`);


//     // ==========================================
//     // GET SLOTS
//     // ==========================================

//     const slots = await Slot.find({
//       doctor: doctorId,

//       date: {
//         $gte: startDate,
//         $lte: endDate,
//       },
//     })
//       .populate(
//         "appointment",
//         "patient status"
//       )
//       .sort({
//         startTime: 1,
//       });


//     // ==========================================
//     // FORMAT SLOTS
//     // ==========================================

//     const formattedSlots = slots.map((slot) => {

//       const appointment = slot.appointment;


//       // Appointment exists and is not cancelled
//       const isBooked =
//         appointment &&
//         appointment.status !== "Cancelled";


//       return {
//         _id: slot._id,

//         doctor: slot.doctor,

//         date: slot.date,

//         day: slot.day,

//         startTime: slot.startTime,

//         endTime: slot.endTime,

//         slotStatus: slot.status,

//         appointmentStatus:
//           appointment?.status || null,

//         isAvailable:
//           slot.status !== "Blocked" &&
//           !isBooked,
//       };

//     });


//     // ==========================================
//     // RESPONSE
//     // ==========================================

//     return res.status(200).json({

//       success: true,

//       date,

//       count: formattedSlots.length,

//       slots: formattedSlots,

//     });


//   } catch (error) {

//     console.error(
//       "Get slots by doctor and date error:",
//       error
//     );

//     return res.status(500).json({

//       success: false,

//       message:
//         "Failed to fetch appointment slots.",

//       error: error.message,

//     });

//   }
// };


// =====================================================
// GET SLOTS BY DOCTOR AND DATE
// =====================================================

export const getSlotsByDoctorAndDate = async (req, res) => {
  try {
    const { doctorId, date } = req.params;

    if (!doctorId || !date) {
      return res.status(400).json({
        success: false,
        message: "Doctor and date are required.",
      });
    }

    // ==========================================
    // VALIDATE DATE
    // ==========================================

    const selectedDate = new Date(`${date}T00:00:00`);

    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date.",
      });
    }

    // ==========================================
    // START / END OF SELECTED DATE
    // ==========================================

    const startDate = new Date(`${date}T00:00:00`);
    const endDate = new Date(`${date}T23:59:59.999`);

    // ==========================================
    // GET ALL SLOTS FOR DOCTOR + DATE
    // ==========================================

    const slots = await Slot.find({
      doctor: doctorId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .populate(
        "appointment",
        "patient status"
      )
      .sort({
        startTime: 1,
      });

    // ==========================================
    // CHECK IF SELECTED DATE IS TODAY
    // ==========================================

    const now = new Date();

    const todayString =
      `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${String(
        now.getDate()
      ).padStart(2, "0")}`;

    const isToday = date === todayString;

    // ==========================================
    // FORMAT SLOTS
    // ==========================================

    const formattedSlots = slots
      .filter((slot) => {

        // ----------------------------------------
        // FUTURE DATE
        // ----------------------------------------

        if (!isToday) {
          return true;
        }

        // ----------------------------------------
        // TODAY
        // ONLY SHOW FUTURE START TIMES
        // ----------------------------------------

        const [hours, minutes] =
          slot.startTime
            .split(":")
            .map(Number);

        const slotDateTime = new Date();

        slotDateTime.setHours(
          hours,
          minutes,
          0,
          0
        );

        // Example:
        // Current = 15:00
        // 14:30 -> false
        // 15:00 -> false
        // 15:30 -> true
        // 16:00 -> true

        return slotDateTime > now;
      })
      .map((slot) => {

        const appointment =
          slot.appointment;

        // ======================================
        // APPOINTMENT BOOKED?
        // ======================================

        const isBooked =
          appointment &&
          appointment.status !== "Cancelled";

        // ======================================
        // FINAL AVAILABILITY
        // ======================================

        const isAvailable =
          slot.status === "Available" &&
          !isBooked;

        return {
          _id: slot._id,

          doctor: slot.doctor,

          date: slot.date,

          day: slot.day,

          startTime: slot.startTime,

          endTime: slot.endTime,

          slotStatus: slot.status,

          appointmentStatus:
            appointment?.status || null,

          isAvailable,
        };
      });

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      date,
      count: formattedSlots.length,
      slots: formattedSlots,
    });

  } catch (error) {

    console.error(
      "Get slots by doctor and date error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch appointment slots.",
      error: error.message,
    });
  }
};