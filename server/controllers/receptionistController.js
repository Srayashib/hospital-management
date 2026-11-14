import bcrypt from "bcryptjs";
import Receptionist from "../models/Receptionist.js";
import User from "../models/User.js";
import PatientProfile from "../models/PatientProfile.js";
import Appointment from "../models/Appointment.js";
// ===============================
// ADD RECEPTIONIST
// ===============================

export const addReceptionist = async (req, res) => {
  try {

    const {
      name,
      email,
      phone,
      gender,
      dateOfBirth,
      bloodGroup,
      address,
      joiningDate,
      weeklyHolidays,
      password,
      status,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !gender ||
      !dateOfBirth ||
      !address ||
      !joiningDate ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    const existingReceptionist =
      await Receptionist.findOne({
        email: email.toLowerCase(),
      });

    if (existingReceptionist) {
      return res.status(400).json({
        success: false,
        message: "Receptionist with this email already exists.",
      });
    }

    const existingPhone =
      await Receptionist.findOne({ phone });

    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists.",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    let holidays = [];

    if (weeklyHolidays) {
      if (Array.isArray(weeklyHolidays)) {
        holidays = weeklyHolidays;
      } else {
        holidays = [weeklyHolidays];
      }
    }

    const image = req.file
      ? req.file.filename
      : null;

    const receptionist =
      await Receptionist.create({
        name,
        email: email.toLowerCase(),
        phone,
        gender,
        dateOfBirth,
        bloodGroup,
        address,
        joiningDate,
        weeklyHolidays: holidays,
        password: hashedPassword,
        status: status || "Active",
        image,
        role: "receptionist",
      });

    res.status(201).json({
      success: true,
      message: "Receptionist added successfully.",
      receptionist,
    });

  } catch (error) {

    console.log("Add Receptionist Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};


// ===============================
// GET ALL RECEPTIONISTS
// ===============================

export const getReceptionists = async (req, res) => {
  try {

    const receptionists =
      await Receptionist.find()
        .select("-password")
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      count: receptionists.length,
      receptionists,
    });

  } catch (error) {

    console.log(
      "Get Receptionists Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to load receptionists.",
    });

  }
};
// ===============================
// GET RECEPTIONIST BY ID
// ===============================

export const getReceptionistById = async (req, res) => {
  try {
    const { id } = req.params;

    const receptionist = await Receptionist.findById(id)
      .select("-password");

    if (!receptionist) {
      return res.status(404).json({
        success: false,
        message: "Receptionist not found.",
      });
    }

    res.status(200).json({
      success: true,
      receptionist,
    });
  } catch (error) {
    console.log(
      "Get Receptionist By ID Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to load receptionist.",
    });
  }
};


// ===============================
// UPDATE RECEPTIONIST
// ===============================

export const updateReceptionist = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      phone,
      gender,
      dateOfBirth,
      bloodGroup,
      address,
      joiningDate,
      weeklyHolidays,
      status,
      removeImage,
    } = req.body;

    const receptionist =
      await Receptionist.findById(id);

    if (!receptionist) {
      return res.status(404).json({
        success: false,
        message: "Receptionist not found.",
      });
    }

    // ===============================
    // CHECK EMAIL
    // ===============================

    const normalizedEmail =
      email.toLowerCase();

    const existingReceptionist =
      await Receptionist.findOne({
        email: normalizedEmail,
        _id: { $ne: id },
      });

    if (existingReceptionist) {
      return res.status(400).json({
        success: false,
        message:
          "Another receptionist already uses this email.",
      });
    }

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });

    /*
     * If your User collection is also used for
     * receptionist authentication, you should
     * exclude the current user's ID here.
     *
     * For now, this only blocks an existing User
     * email if it belongs to another account.
     */

    if (
      existingUser &&
      existingUser.email !== receptionist.email
    ) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // ===============================
    // CHECK PHONE
    // ===============================

    const existingPhone =
      await Receptionist.findOne({
        phone,
        _id: { $ne: id },
      });

    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message:
          "Another receptionist already uses this phone number.",
      });
    }

    // ===============================
    // WEEKLY HOLIDAYS
    // ===============================

    let holidays = [];

    if (weeklyHolidays) {
      if (Array.isArray(weeklyHolidays)) {
        holidays = weeklyHolidays;
      } else {
        try {
          holidays = JSON.parse(
            weeklyHolidays
          );
        } catch (error) {
          holidays = [weeklyHolidays];
        }
      }
    }

    // ===============================
    // UPDATE BASIC DATA
    // ===============================

    receptionist.name = name;
    receptionist.email = normalizedEmail;
    receptionist.phone = phone;
    receptionist.gender = gender;
    receptionist.dateOfBirth = dateOfBirth;
    receptionist.bloodGroup = bloodGroup;
    receptionist.address = address;
    receptionist.joiningDate = joiningDate;
    receptionist.weeklyHolidays = holidays;
    receptionist.status = status || "Active";

    // ===============================
    // IMAGE
    // ===============================

    if (req.file) {
      receptionist.image =
        req.file.filename;
    } else if (
      removeImage === "true" ||
      removeImage === true
    ) {
      receptionist.image = null;
    }

    await receptionist.save();

    const updatedReceptionist =
      await Receptionist.findById(id)
        .select("-password");

    res.status(200).json({
      success: true,
      message:
        "Receptionist updated successfully.",
      receptionist: updatedReceptionist,
    });
  } catch (error) {
    console.log(
      "Update Receptionist Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to update receptionist.",
    });
  }
};

// ===============================
// DELETE RECEPTIONIST
// ===============================

export const deleteReceptionist = async (
  req,
  res
) => {
  try {

    const { id } = req.params;

    const receptionist =
      await Receptionist.findById(id);

    if (!receptionist) {
      return res.status(404).json({
        success: false,
        message: "Receptionist not found.",
      });
    }

    await Receptionist.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Receptionist deleted successfully.",
    });

  } catch (error) {

    console.log(
      "Delete Receptionist Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to delete receptionist.",
    });

  }
};

export const searchPatientByEmail=async(req,res)=>{
  try{
    const {email}=req.query;
    if(!email||!email.trim){
      return res.status(200).json({
        success:true,
        patients:[],
      });
    }
    const patients=await User.find({
      role:"patient",
      email:{
        $regex:email.trim(),
        $options:"i",
      }
    }).select("_id name email phone").limit(10);
    return res.status(200).json({
      success: true,
      patients,
    });

  }catch (error) {

    console.error(
      "Search patient error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to search patients",
    });

  }
};
/* =====================================================
   GET ALL PATIENTS
   GET /api/receptionists/patients
===================================================== */

export const getPatients = async (req, res) => {
  try {

    /* =========================================
       GET ALL PATIENT USERS
    ========================================= */

    const users = await User.find({
      role: "patient",
    })
      .select("-password")
      .sort({
        createdAt: -1,
      });


    /* =========================================
       GET PATIENT PROFILES
    ========================================= */

    const userIds = users.map(
      (user) => user._id
    );

    const profiles = await PatientProfile.find({
      user: {
        $in: userIds,
      },
    });


    /* =========================================
       CREATE PROFILE MAP
    ========================================= */

    const profileMap = new Map();

    profiles.forEach((profile) => {

      profileMap.set(
        profile.user.toString(),
        profile
      );

    });


    /* =========================================
       COMBINE USER + PATIENT PROFILE
    ========================================= */

    const patients = users.map((user) => {

      const profile =
        profileMap.get(
          user._id.toString()
        );


      return {

        _id: user._id,

        name: user.name,

        email: user.email,

        phone: user.phone || "",

        role: user.role,

        status: user.status || "Active",

        createdAt: user.createdAt,

        dateOfBirth:
          profile?.dateOfBirth || null,

        gender:
          profile?.gender || "",

        address:
          profile?.address || "",

      };

    });


    /* =========================================
       SUMMARY
    ========================================= */

    const totalPatients =
      patients.length;


    const activePatients =
      patients.filter(
        (patient) =>
          patient.status === "Active"
      ).length;


    /* =========================================
       NEW PATIENTS THIS MONTH
    ========================================= */

    const now = new Date();

    const startOfMonth =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );


    const newThisMonth =
      patients.filter((patient) => {

        if (!patient.createdAt) {
          return false;
        }

        return (
          new Date(patient.createdAt) >=
          startOfMonth
        );

      }).length;


    /* =========================================
       RESPONSE
    ========================================= */

    return res.status(200).json({

      success: true,

      patients,

      summary: {

        totalPatients,

        activePatients,

        newThisMonth,

      },

    });

  } catch (error) {

    console.error(
      "Get patients error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch patients",

      error: error.message,

    });

  }
};

// =====================================================
// CHECK RECEPTIONIST
// =====================================================

const checkReceptionist = (req, res) => {
  if (req.user?.role !== "receptionist") {
    res.status(403).json({
      success: false,
      message: "Receptionist access required.",
    });

    return false;
  }

  return true;
};

// =====================================================
// GET ALL COMPLETED BUT UNPAID APPOINTMENTS
// =====================================================

export const getPendingPayments = async (req, res) => {
  try {
    if (!checkReceptionist(req, res)) return;

    const appointments = await Appointment.find({
      status: "Completed",
      paymentStatus: {
        $ne: "Paid",
      },
    })
      .populate(
        "patient",
        "name email phone"
      )
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
      "Get pending payments error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch pending payments.",
      error: error.message,
    });
  }
};

// =====================================================
// MARK QR / MANUAL PAYMENT AS PAID
// =====================================================

export const markPaymentAsPaid = async (req, res) => {
  try {
    if (!checkReceptionist(req, res)) return;

    const { appointmentId } = req.params;

    const {
      paymentMethod,
      paymentTransactionId,
      paymentAmount,
    } = req.body;

    const appointment =
      await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    if (appointment.status !== "Completed") {
      return res.status(400).json({
        success: false,
        message:
          "Payment can only be processed for a completed appointment.",
      });
    }

    if (appointment.paymentStatus === "Paid") {
      return res.status(400).json({
        success: false,
        message: "This appointment is already paid.",
      });
    }

    const amount =
      Number(paymentAmount) ||
      Number(appointment.fee) ||
      0;

    appointment.paymentStatus = "Paid";

    appointment.paymentMethod =
      paymentMethod || "QR";

    appointment.paymentAmount = amount;

    appointment.paymentTransactionId =
      paymentTransactionId || "";

    appointment.paidAt = new Date();

    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Payment recorded successfully.",
      appointment,
    });
  } catch (error) {
    console.error(
      "Mark payment as paid error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to record payment.",
      error: error.message,
    });
  }
};

// =====================================================
// RECEPTIONIST DASHBOARD STATS
// =====================================================

// export const getReceptionistDashboardStats = async (
//   req,
//   res
// ) => {
//   try {
//     const startOfToday = new Date();
//     startOfToday.setHours(0, 0, 0, 0);

//     const endOfToday = new Date();
//     endOfToday.setHours(23, 59, 59, 999);

//     const startOfYesterday = new Date(
//       startOfToday
//     );
//     startOfYesterday.setDate(
//       startOfYesterday.getDate() - 1
//     );

//     const endOfYesterday = new Date(
//       endOfToday
//     );
//     endOfYesterday.setDate(
//       endOfYesterday.getDate() - 1
//     );

//     // =================================================
//     // TODAY'S APPOINTMENTS
//     // =================================================

//     const todayAppointments =
//       await Appointment.find({
//         date: {
//           $gte: startOfToday,
//           $lte: endOfToday,
//         },
//       })
//         .select(
//           "patient status paymentStatus paymentAmount fee paidAt date"
//         )
//         .lean();

//     // =================================================
//     // YESTERDAY'S APPOINTMENTS
//     // =================================================

//     const yesterdayAppointments =
//       await Appointment.find({
//         date: {
//           $gte: startOfYesterday,
//           $lte: endOfYesterday,
//         },
//       })
//         .select(
//           "patient status paymentStatus paymentAmount fee paidAt date"
//         )
//         .lean();

//     // =================================================
//     // UNIQUE PATIENTS
//     // =================================================

//     const todayPatientIds =
//       new Set(
//         todayAppointments
//           .map((appointment) =>
//             appointment.patient?.toString()
//           )
//           .filter(Boolean)
//       );

//     const yesterdayPatientIds =
//       new Set(
//         yesterdayAppointments
//           .map((appointment) =>
//             appointment.patient?.toString()
//           )
//           .filter(Boolean)
//       );

//     // =================================================
//     // WAITING PATIENTS
//     // CHECKED IN
//     // =================================================

//     const todayWaitingPatientIds =
//       new Set(
//         todayAppointments
//           .filter(
//             (appointment) =>
//               appointment.status ===
//               "Checked In"
//           )
//           .map((appointment) =>
//             appointment.patient?.toString()
//           )
//           .filter(Boolean)
//       );

//     const yesterdayWaitingPatientIds =
//       new Set(
//         yesterdayAppointments
//           .filter(
//             (appointment) =>
//               appointment.status ===
//               "Checked In"
//           )
//           .map((appointment) =>
//             appointment.patient?.toString()
//           )
//           .filter(Boolean)
//       );

//     // =================================================
//     // TODAY'S COLLECTION
//     // ONLY SUCCESSFULLY PAID
//     // =================================================

//     const todayCollection =
//       todayAppointments.reduce(
//         (total, appointment) => {

//           if (
//             appointment.paymentStatus ===
//             "Paid"
//           ) {
//             return (
//               total +
//               Number(
//                 appointment.paymentAmount ||
//                   appointment.fee ||
//                   0
//               )
//             );
//           }

//           return total;
//         },
//         0
//       );

//     // =================================================
//     // YESTERDAY'S COLLECTION
//     // =================================================

//     const yesterdayCollection =
//       yesterdayAppointments.reduce(
//         (total, appointment) => {

//           if (
//             appointment.paymentStatus ===
//             "Paid"
//           ) {
//             return (
//               total +
//               Number(
//                 appointment.paymentAmount ||
//                   appointment.fee ||
//                   0
//               )
//             );
//           }

//           return total;
//         },
//         0
//       );

//     // =================================================
//     // CHANGE CALCULATOR
//     // =================================================

//     const calculateChange = (
//       today,
//       yesterday
//     ) => {

//       if (
//         yesterday === 0 &&
//         today === 0
//       ) {
//         return 0;
//       }

//       if (
//         yesterday === 0 &&
//         today > 0
//       ) {
//         return 100;
//       }

//       return Math.round(
//         ((today - yesterday) /
//           yesterday) *
//           100
//       );
//     };

//     const patientChange =
//       calculateChange(
//         todayPatientIds.size,
//         yesterdayPatientIds.size
//       );

//     const appointmentChange =
//       calculateChange(
//         todayAppointments.length,
//         yesterdayAppointments.length
//       );

//     const waitingChange =
//       calculateChange(
//         todayWaitingPatientIds.size,
//         yesterdayWaitingPatientIds.size
//       );

//     const collectionChange =
//       calculateChange(
//         todayCollection,
//         yesterdayCollection
//       );

//     return res.status(200).json({
//       success: true,

//       stats: {
//         todayPatients:
//           todayPatientIds.size,

//         todayAppointments:
//           todayAppointments.length,

//         waitingPatients:
//           todayWaitingPatientIds.size,

//         todayCollection:

//           Number(
//             todayCollection.toFixed(2)
//           ),

//         patientChange,

//         appointmentChange,

//         waitingChange,

//         collectionChange,
//       },
//     });

//   } catch (error) {

//     console.error(
//       "Receptionist dashboard stats error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to load receptionist dashboard stats.",
//       error: error.message,
//     });
//   }
// };
// =====================================================
// RECEPTIONIST DASHBOARD STATS
// =====================================================

export const getReceptionistDashboardStats = async (req, res) => {
  try {
    if (req.user?.role !== "receptionist") {
      return res.status(403).json({
        success: false,
        message: "Receptionist access required.",
      });
    }

    const now = new Date();

    // =====================================================
    // TODAY
    // =====================================================

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    // =====================================================
    // YESTERDAY
    // =====================================================

    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    const endOfYesterday = new Date(startOfToday);
    endOfYesterday.setMilliseconds(-1);

    // =====================================================
    // TODAY'S APPOINTMENTS
    // =====================================================

    const todayAppointments = await Appointment.find({
      date: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
    })
      .select(
        "patient status paymentStatus paymentAmount fee paymentMethod paidAt date"
      )
      .lean();

    // =====================================================
    // YESTERDAY'S APPOINTMENTS
    // =====================================================

    const yesterdayAppointments = await Appointment.find({
      date: {
        $gte: startOfYesterday,
        $lte: endOfYesterday,
      },
    })
      .select("patient status")
      .lean();

    // =====================================================
    // UNIQUE PATIENTS TODAY
    // =====================================================

    const todayPatientIds = new Set(
      todayAppointments
        .map((appointment) =>
          appointment.patient?.toString()
        )
        .filter(Boolean)
    );

    // =====================================================
    // UNIQUE WAITING PATIENTS TODAY
    // =====================================================

    const waitingPatientIds = new Set(
      todayAppointments
        .filter(
          (appointment) =>
            appointment.status === "Checked In"
        )
        .map((appointment) =>
          appointment.patient?.toString()
        )
        .filter(Boolean)
    );

    // =====================================================
    // UNIQUE PATIENTS YESTERDAY
    // =====================================================

    const yesterdayPatientIds = new Set(
      yesterdayAppointments
        .map((appointment) =>
          appointment.patient?.toString()
        )
        .filter(Boolean)
    );

    // =====================================================
    // WAITING PATIENTS YESTERDAY
    // =====================================================

    const yesterdayWaitingPatientIds = new Set(
      yesterdayAppointments
        .filter(
          (appointment) =>
            appointment.status === "Checked In"
        )
        .map((appointment) =>
          appointment.patient?.toString()
        )
        .filter(Boolean)
    );

    // =====================================================
    // TODAY'S PAID PAYMENTS
    // IMPORTANT:
    // Uses paidAt, not appointment date
    // =====================================================

    const todayPaidAppointments =
      await Appointment.find({
        paymentStatus: "Paid",
        paidAt: {
          $gte: startOfToday,
          $lte: endOfToday,
        },
      })
        .select(
          "paymentMethod paymentAmount fee paidAt"
        )
        .lean();

    // =====================================================
    // YESTERDAY'S PAID PAYMENTS
    // =====================================================

    const yesterdayPaidAppointments =
      await Appointment.find({
        paymentStatus: "Paid",
        paidAt: {
          $gte: startOfYesterday,
          $lte: endOfYesterday,
        },
      })
        .select(
          "paymentMethod paymentAmount fee paidAt"
        )
        .lean();

    // =====================================================
    // TODAY'S COLLECTION
    // =====================================================

    const todayCollection =
      todayPaidAppointments.reduce(
        (total, appointment) => {
          return (
            total +
            Number(
              appointment.paymentAmount ||
                appointment.fee ||
                0
            )
          );
        },
        0
      );

    // =====================================================
    // YESTERDAY'S COLLECTION
    // =====================================================

    const yesterdayCollection =
      yesterdayPaidAppointments.reduce(
        (total, appointment) => {
          return (
            total +
            Number(
              appointment.paymentAmount ||
                appointment.fee ||
                0
            )
          );
        },
        0
      );

    // =====================================================
    // PAYMENT BREAKDOWN
    // =====================================================

    let cashCollection = 0;
    let cardCollection = 0;
    let onlineCollection = 0;

    todayPaidAppointments.forEach((appointment) => {
      const amount = Number(
        appointment.paymentAmount ||
          appointment.fee ||
          0
      );

      const method = appointment.paymentMethod;

      if (method === "Cash") {
        cashCollection += amount;
      }

      if (method === "Card") {
        cardCollection += amount;
      }

      // QR + PayPal = Online
      if (
        method === "QR" ||
        method === "PayPal"
      ) {
        onlineCollection += amount;
      }
    });

    // =====================================================
    // PERCENTAGE CHANGE
    // =====================================================

    const calculateChange = (
      todayValue,
      yesterdayValue
    ) => {
      if (yesterdayValue === 0) {
        if (todayValue === 0) {
          return 0;
        }

        return 100;
      }

      return Number(
        (
          ((todayValue - yesterdayValue) /
            yesterdayValue) *
          100
        ).toFixed(1)
      );
    };

    // =====================================================
    // FINAL STATS
    // =====================================================

    const stats = {
      // Dashboard stats
      todayPatients: todayPatientIds.size,

      todayAppointments:
        todayAppointments.length,

      waitingPatients:
        waitingPatientIds.size,

      // Collection
      todayCollection,

      // Changes
      patientChange: calculateChange(
        todayPatientIds.size,
        yesterdayPatientIds.size
      ),

      appointmentChange: calculateChange(
        todayAppointments.length,
        yesterdayAppointments.length
      ),

      waitingChange: calculateChange(
        waitingPatientIds.size,
        yesterdayWaitingPatientIds.size
      ),

      collectionChange: calculateChange(
        todayCollection,
        yesterdayCollection
      ),

      // Payment breakdown
      cashCollection,

      cardCollection,

      onlineCollection,
    };

    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error(
      "Get receptionist dashboard stats error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch receptionist dashboard stats.",
      error: error.message,
    });
  }
};
// =====================================================
// RECEPTIONIST APPOINTMENT CHART
// =====================================================

export const getReceptionistAppointmentChart = async (req, res) => {
  try {
    if (req.user?.role !== "receptionist") {
      return res.status(403).json({
        success: false,
        message: "Receptionist access required.",
      });
    }

    const { period = "this-week" } = req.query;

    const now = new Date();

    let startDate;
    let endDate;

    // =====================================================
    // THIS WEEK
    // Monday -> Sunday
    // =====================================================

    if (period === "this-week") {
      const currentDay = now.getDay(); // Sun = 0, Mon = 1

      const mondayOffset =
        currentDay === 0 ? -6 : 1 - currentDay;

      startDate = new Date(now);
      startDate.setDate(
        now.getDate() + mondayOffset
      );
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(startDate);
      endDate.setDate(
        startDate.getDate() + 7
      );
      endDate.setMilliseconds(-1);
    }

    // =====================================================
    // LAST WEEK
    // =====================================================

    else if (period === "last-week") {
      const currentDay = now.getDay();

      const mondayOffset =
        currentDay === 0 ? -6 : 1 - currentDay;

      startDate = new Date(now);
      startDate.setDate(
        now.getDate() + mondayOffset - 7
      );
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(startDate);
      endDate.setDate(
        startDate.getDate() + 7
      );
      endDate.setMilliseconds(-1);
    }

    // =====================================================
    // THIS MONTH
    // =====================================================

    else if (period === "this-month") {
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        1
      );
      endDate.setMilliseconds(-1);
    }

    else {
      return res.status(400).json({
        success: false,
        message: "Invalid chart period.",
      });
    }

    // =====================================================
    // FETCH APPOINTMENTS
    // =====================================================

    const appointments = await Appointment.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .select("date")
      .lean();

    // =====================================================
    // BUILD DAILY COUNTS
    // =====================================================

    const data = [];

    const cursor = new Date(startDate);

    while (cursor <= endDate) {
      const dayStart = new Date(cursor);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(cursor);
      dayEnd.setHours(23, 59, 59, 999);

      const count = appointments.filter(
        (appointment) => {
          const appointmentDate =
            new Date(appointment.date);

          return (
            appointmentDate >= dayStart &&
            appointmentDate <= dayEnd
          );
        }
      ).length;

      // =====================================================
      // LABEL
      // =====================================================

      let label;

      if (
        period === "this-week" ||
        period === "last-week"
      ) {
        label = dayStart.toLocaleDateString(
          "en-US",
          {
            weekday: "short",
          }
        );
      } else {
        label = dayStart.getDate().toString();
      }

      data.push({
        day: label,
        value: count,
        date: dayStart.toISOString(),
      });

      cursor.setDate(
        cursor.getDate() + 1
      );
    }

    return res.status(200).json({
      success: true,
      period,
      data,
    });
  } catch (error) {
    console.error(
      "Get receptionist appointment chart error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch appointment chart data.",
      error: error.message,
    });
  }
};
// =====================================================
// GET RECEPTIONIST APPOINTMENTS
// GET /api/receptionists/appointments
// =====================================================

export const getReceptionistAppointments = async (req, res) => {
  try {
    if (req.user?.role !== "receptionist") {
      return res.status(403).json({
        success: false,
        message: "Receptionist access required.",
      });
    }

    const {
      filter = "today",
      department = "all",
    } = req.query;

    let startDate;
    let endDate;

    // =====================================================
    // TODAY
    // =====================================================

    if (filter === "today") {
      const now = new Date();

      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);
    }

    // =====================================================
    // ALL
    // =====================================================

    else {
      startDate = null;
      endDate = null;
    }

    // =====================================================
    // QUERY
    // =====================================================

    const query = {};

    if (startDate && endDate) {
      query.date = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    // =====================================================
    // DEPARTMENT FILTER
    // =====================================================

    let appointments;

    if (department && department !== "all") {
      appointments = await Appointment.find(query)
        .populate(
          "patient",
          "name email phone"
        )
        .populate(
          "doctor",
          "name department qualification"
        )
        .lean();

      appointments = appointments.filter(
        (appointment) =>
          appointment.doctor?.department ===
          department
      );
    } else {
      appointments = await Appointment.find(query)
        .populate(
          "patient",
          "name email phone"
        )
        .populate(
          "doctor",
          "name department qualification"
        )
        .sort({
          date: 1,
          startTime: 1,
        })
        .lean();
    }

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error(
      "Get receptionist appointments error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch receptionist appointments.",
      error: error.message,
    });
  }
};