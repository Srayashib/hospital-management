
import User from "../models/User.js";
import PatientProfile from "../models/PatientProfile.js";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";

// =====================================================
// GET ALL PATIENTS FOR ADMIN
// GET /api/admin/patients
// =====================================================

export const getAdminPatients = async (req, res) => {
  try {
    // =====================================================
    // ADMIN CHECK
    // =====================================================

    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required.",
      });
    }

    // =====================================================
    // GET ALL PATIENT USERS
    // =====================================================

    const users = await User.find({
      role: "patient",
    })
      .select("_id name email phone createdAt")
      .sort({
        createdAt: -1,
      })
      .lean();

    // =====================================================
    // PATIENT IDS
    // =====================================================

    const patientIds = users.map(
      (user) => user._id
    );

    // =====================================================
    // GET PATIENT PROFILES
    // =====================================================

    const profiles =
      await PatientProfile.find({
        user: {
          $in: patientIds,
        },
      })
        .select(
          "user dateOfBirth gender bloodGroup address"
        )
        .lean();

    // =====================================================
    // PROFILE MAP
    // =====================================================

    const profileMap = new Map();

    profiles.forEach((profile) => {
      profileMap.set(
        profile.user.toString(),
        profile
      );
    });

    // =====================================================
    // GET APPOINTMENTS
    // NEWEST FIRST
    // =====================================================

    const appointments =
      await Appointment.find({
        patient: {
          $in: patientIds,
        },
      })
        .populate(
          "doctor",
          "name department qualification"
        )
        .select(
          "patient doctor date startTime status"
        )
        .sort({
          date: -1,
          startTime: -1,
        })
        .lean();

    // =====================================================
    // GET LATEST DOCTOR FOR EACH PATIENT
    // =====================================================

    const doctorMap = new Map();

    appointments.forEach((appointment) => {
      if (!appointment.patient) {
        return;
      }

      const patientId =
        appointment.patient.toString();

      // First appointment is the newest because
      // appointments were sorted descending.
      if (!doctorMap.has(patientId)) {
        doctorMap.set(
          patientId,
          appointment.doctor || null
        );
      }
    });

    // =====================================================
    // CALCULATE AGE
    // =====================================================

    const calculateAge = (dateOfBirth) => {
      if (!dateOfBirth) {
        return null;
      }

      const birthDate =
        new Date(dateOfBirth);

      if (
        Number.isNaN(
          birthDate.getTime()
        )
      ) {
        return null;
      }

      const today = new Date();

      let age =
        today.getFullYear() -
        birthDate.getFullYear();

      const monthDifference =
        today.getMonth() -
        birthDate.getMonth();

      if (
        monthDifference < 0 ||
        (
          monthDifference === 0 &&
          today.getDate() <
            birthDate.getDate()
        )
      ) {
        age--;
      }

      return age;
    };

    // =====================================================
    // BUILD PATIENT LIST
    // =====================================================

    const patients = users.map((user) => {
      const profile =
        profileMap.get(
          user._id.toString()
        );

      const doctor =
        doctorMap.get(
          user._id.toString()
        );

      return {
        _id: user._id,
        name: user.name || "N/A",
        email: user.email || "",
        phone: user.phone || "",

        age:
          calculateAge(
            profile?.dateOfBirth
          ),

        gender:
          profile?.gender || "N/A",

        doctor: doctor
          ? {
              _id: doctor._id,
              name:
                doctor.name || "Doctor",
              department:
                doctor.department || "",
              qualification:
                doctor.qualification || "",
            }
          : null,

        dateOfBirth:
          profile?.dateOfBirth || null,

        bloodGroup:
          profile?.bloodGroup || "",

        createdAt:
          user.createdAt,
      };
    });

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,
      count: patients.length,
      patients,
    });

  } catch (error) {
    console.error(
      "Get admin patients error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch patients.",
      error: error.message,
    });
  }
};
// =====================================================
// DELETE PATIENT
// DELETE /api/admin/patients/:patientId
// =====================================================

export const deleteAdminPatient = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required.",
      });
    }

    const { patientId } = req.params;

    const patient = await User.findOne({
      _id: patientId,
      role: "patient",
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    // Remove patient profile
    await PatientProfile.findOneAndDelete({
      user: patientId,
    });

    // Remove patient account
    await User.findByIdAndDelete(patientId);

    return res.status(200).json({
      success: true,
      message: "Patient deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete admin patient error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete patient.",
      error: error.message,
    });
  }
};

// =====================================================
// GET RECENT APPOINTMENTS FOR ADMIN DASHBOARD
// =====================================================

export const getAdminRecentAppointments = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const appointments = await Appointment.find({})
      .populate("patient", "name email")
      .populate("doctor", "name department")
      .sort({ createdAt: -1, date: -1 })
      .limit(20)
      .lean();

    const formattedAppointments = appointments.map((appointment) => ({
      id: appointment._id,
      patient: appointment.patient?.name || "Unknown Patient",
      doctor: appointment.doctor?.name || "Unknown Doctor",
      department: appointment.doctor?.department || "Unassigned",
      date: appointment.date,
      status: appointment.status,
    }));

    return res.status(200).json({
      success: true,
      appointments: formattedAppointments,
    });
  } catch (error) {
    console.error("Admin recent appointments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent appointments.",
    });
  }
};

// export const getAdminDashboardStats = async (req, res) => {
//   try {
//     if (req.user?.role !== "admin") {
//       return res.status(403).json({
//         success: false,
//         message: "Access denied. Admin only.",
//       });
//     }

//     const [
//       doctors,
//       patients,
//       appointments,
//       revenueResult,
//     ] = await Promise.all([
//       Doctor.countDocuments({}),
//       User.countDocuments({ role: "patient" }),
//       Appointment.countDocuments({}),
//       Appointment.aggregate([
//         {
//           $match: {
//             status: "Completed",
//             paymentStatus: "Paid",
//           },
//         },
//         {
//           $group: {
//             _id: null,
//             totalRevenue: {
//               $sum: {
//                 $ifNull: ["$paymentAmount", 0],
//               },
//             },
//           },
//         },
//       ]),
//     ]);

//     const revenue = revenueResult[0]?.totalRevenue || 0;

//     return res.status(200).json({
//       success: true,
//       stats: {
//         doctors,
//         patients,
//         appointments,
//         revenue,
//       },
//     });
//    } catch (error) {
//     console.error("Admin dashboard stats error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to load dashboard statistics.",
//       error:
//         process.env.NODE_ENV === "development"
//           ? error.message
//           : undefined,
//     });
//   }
// };



export const getAdminDashboardStats = async (req, res) => {
  try {
    // Admin access check
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const now = new Date();

    // First day of the month, six months ago
    const startDate = new Date(
      now.getFullYear(),
      now.getMonth() - 6,
      1
    );

    // Fetch dashboard data in parallel
    const [
      doctors,
      patients,
      appointments,
      revenueResult,
      monthlyRevenueResult,
      appointmentStatusResult,
    ] = await Promise.all([
      // Total doctors
      Doctor.countDocuments({}),

      // Total registered patients
      User.countDocuments({
        role: "patient",
      }),

      // Total appointments
      Appointment.countDocuments({}),

      // Total revenue from completed and paid appointments
      Appointment.aggregate([
        {
          $match: {
            status: "Completed",
            paymentStatus: "Paid",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: {
                $ifNull: ["$paymentAmount", 0],
              },
            },
          },
        },
      ]),

      // Monthly revenue for the last seven months
      Appointment.aggregate([
        {
          $match: {
            status: "Completed",
            paymentStatus: "Paid",
            createdAt: {
              $gte: startDate,
              $lte: now,
            },
          },
        },
        {
          $group: {
            _id: {
              year: {
                $year: "$createdAt",
              },
              month: {
                $month: "$createdAt",
              },
            },
            revenue: {
              $sum: {
                $ifNull: ["$paymentAmount", 0],
              },
            },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]),

      // Appointment counts grouped by actual status
      Appointment.aggregate([
        {
          $group: {
            _id: "$status",
            value: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]),
    ]);

    // Total revenue
    const revenue =
      revenueResult[0]?.totalRevenue || 0;

    // Create all seven month labels, including zero-revenue months
    const monthlyRevenue = [];

    for (let i = 6; i >= 0; i--) {
      const monthDate = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      );

      const year = monthDate.getFullYear();
      const month = monthDate.getMonth() + 1;

      const matchingMonth = monthlyRevenueResult.find(
        (item) =>
          item._id.year === year &&
          item._id.month === month
      );

      monthlyRevenue.push({
        month: monthDate.toLocaleString("en-US", {
          month: "short",
        }),
        revenue: matchingMonth?.revenue || 0,
      });
    }

    // Format appointment status data for the pie chart
    const appointmentStatus = appointmentStatusResult.map(
      (item) => ({
        name: item._id || "Unknown",
        value: item.value,
      })
    );

    // Send dashboard response
    return res.status(200).json({
      success: true,
      stats: {
        doctors,
        patients,
        appointments,
        revenue,
        monthlyRevenue,
        appointmentStatus,
      },
    });
  } catch (error) {
    console.error(
      "Admin dashboard stats error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard statistics.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};
