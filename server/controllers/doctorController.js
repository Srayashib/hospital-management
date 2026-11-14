import bcrypt from "bcryptjs";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import PatientProfile from "../models/PatientProfile.js";
import mongoose from "mongoose";
// ==========================================
// Create Doctor
// ==========================================
export const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      gender,
      dob,
      bloodGroup,
      address,
      department,
      qualification,
      experience,
      fee,
      license,
      joiningDate,
      weeklyHolidays,
      password,
      status,
    } = req.body;

    // Check required fields
    if (
      !name ||
      !email ||
      !phone ||
      !department ||
      !qualification ||
      !license ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    // Check existing email
    const existingEmail = await Doctor.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Doctor email already exists.",
      });
    }

    // Check existing license
    const existingLicense = await Doctor.findOne({ license });

    if (existingLicense) {
      return res.status(400).json({
        success: false,
        message: "License number already exists.",
      });
    }

    // Encrypt Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Image
    const image = req.file ? req.file.filename : "";
    const holidays = weeklyHolidays
      ? JSON.parse(weeklyHolidays)
      : [];
      if (holidays.length !== 2) {
        return res.status(400).json({
          success: false,
          message: "Please select exactly 2 weekly holidays.",
        });
      }

    // Save Doctor
    const doctor = await Doctor.create({
      name,
      email,
      phone,
      gender,
      dob,
      bloodGroup,
      address,
      department,
      qualification,
      experience,
      fee,
      license,
      joiningDate,
      password: hashedPassword,
      weeklyHolidays: holidays,
      image,
      status,
      role: "doctor",
    });

    res.status(201).json({
      success: true,
      message: "Doctor added successfully.",
      doctor,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const deleteDoctors = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    await Doctor.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
    });

  }

    catch (error) {
  console.log(error);

  toast.error(
    error.response?.data?.message ||
    error.response?.data?.msg ||
    error.message
  );
}
};

export const getDoctorById=async(req,res)=>{
  try{
    const doctor=await Doctor.findById(req.params.id).select("-password");

    if(!doctor){
       return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }
    res.json({
      success: true,
      doctor,
    });
  }
   catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export const updateDoctor = async (req, res) => {
  try {

    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const data = {
      ...req.body,
    };

    let holidays = [];

    if (req.body.weeklyHolidays) {
      holidays = JSON.parse(req.body.weeklyHolidays);
    }
    data.weeklyHolidays = holidays;

    if (req.file) {
      data.image = req.file.filename;
    }

    await Doctor.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );

    res.json({
      success: true,
      message: "Doctor updated successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
export const getMyProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id).select("-password");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDoctorsByDepartment=async(req,res)=>{
  try{
    const {department}=req.query;
    if(!department){
      return res.status(400).json({
        success:false,
        message:"Department is required",
      });
    }
    const doctors=await Doctor.find({
      department:department,
      status:"Active",
    }).select("_id name email department fee image");
    return res.status(200).json({
      success:true,
      doctors,
    });
  }
   catch (error) {
    console.error("Get doctors by department error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctors",
    });
  }
}

export const getDoctorTodayAppointments = async (req, res) => {
  try {

    // =====================================================
    // LOGGED-IN DOCTOR
    // =====================================================

    const doctorId = req.user.id;

    // =====================================================
    // CHECK DOCTOR
    // =====================================================

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    // =====================================================
    // TODAY DATE RANGE
    // =====================================================

    const today = new Date();

    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    // =====================================================
    // GET ONLY TODAY'S CONFIRMED APPOINTMENTS
    // FOR THIS DOCTOR
    // =====================================================

    const appointments = await Appointment.find({
      doctor: doctor._id,

      date: {
        $gte: startOfToday,
        $lte: endOfToday,
      },

      status: {
  $in: ["Confirmed", "Checked In" ,"Pending"],
}
    })
      .populate(
        "patient",
        "name email phone"
      )
      .populate(
        "slot",
        "date day startTime endTime status"
      )
      .sort({
        startTime: 1,
      });

    // =====================================================
    // GET PATIENT PROFILES
    // =====================================================

    const PatientProfile = mongoose.model(
      "PatientProfile"
    );

    const patientIds = appointments
      .map(
        (appointment) =>
          appointment.patient?._id
      )
      .filter(Boolean);

    const patientProfiles =
      await PatientProfile.find({
        user: {
          $in: patientIds,
        },
      }).select(
        "user dateOfBirth"
      );
      // =====================================================
// GET LAST COMPLETED VISIT FOR EACH PATIENT
// =====================================================

const lastCompletedAppointments =
  await Appointment.find({
    doctor: doctor._id,

    patient: {
      $in: patientIds,
    },

    status: "Completed",

    date: {
      $lt: startOfToday,
    },
  })
    .select("patient date")
    .sort({
      date: -1,
    });


// =====================================================
// CREATE LAST VISIT MAP
// =====================================================

const lastVisitMap = {};

lastCompletedAppointments.forEach(
  (appointment) => {

    const patientId =
      appointment.patient.toString();

    // Only keep the latest completed visit
    if (!lastVisitMap[patientId]) {

      lastVisitMap[patientId] =
        appointment.date;

    }

  }
);

    // =====================================================
    // CREATE DOB MAP
    // =====================================================

    const patientProfileMap = {};

    patientProfiles.forEach((profile) => {

      patientProfileMap[
        profile.user.toString()
      ] = profile;

    });

    // =====================================================
    // ADD PATIENT DOB TO APPOINTMENTS
    // =====================================================

    const appointmentsWithPatientProfile =
      appointments.map((appointment) => {

        const patientId =
          appointment.patient?._id?.toString();

        const profile =
          patientProfileMap[patientId];

        return {
          ...appointment.toObject(),

          patient: appointment.patient
            ? {
                ...appointment.patient.toObject(),

                dateOfBirth:
                  profile?.dateOfBirth || null,

                lastVisit:
                  lastVisitMap[patientId] || null,
              }
            : null,
        };

      });

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      count:
        appointmentsWithPatientProfile.length,

      appointments:
        appointmentsWithPatientProfile,
    });

  } catch (error) {

    console.error(
      "Get doctor today appointments error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch today's appointments.",

      error: error.message,
    });

  }
};

// =====================================================
// GET ALL TODAY'S APPOINTMENTS FOR LOGGED-IN DOCTOR
// Includes all appointment statuses
// =====================================================

// export const getDoctorAllTodayAppointments = async (req, res) => {
//   try {
//     // =====================================================
//     // LOGGED-IN DOCTOR
//     // =====================================================

//     const doctorId = req.user.id || req.user._id;

//     // =====================================================
//     // CHECK DOCTOR
//     // =====================================================

//     const doctor = await Doctor.findById(doctorId);

//     if (!doctor) {
//       return res.status(404).json({
//         success: false,
//         message: "Doctor not found.",
//       });
//     }

//     // =====================================================
//     // TODAY DATE RANGE
//     // =====================================================

//     const today = new Date();

//     const startOfToday = new Date(today);
//     startOfToday.setHours(0, 0, 0, 0);

//     const endOfToday = new Date(today);
//     endOfToday.setHours(23, 59, 59, 999);

//     // =====================================================
//     // GET ALL TODAY'S APPOINTMENTS
//     // NO STATUS FILTER
//     // =====================================================

//     const appointments = await Appointment.find({
//       doctor: doctor._id,

//       date: {
//         $gte: startOfToday,
//         $lte: endOfToday,
//       },
//     })
//       .populate(
//         "patient",
//         "name email phone"
//       )
//       .populate(
//         "slot",
//         "date day startTime endTime status"
//       )
//       .sort({
//         startTime: 1,
//       });

//     // =====================================================
//     // GET PATIENT PROFILES
//     // =====================================================

//     const PatientProfile = mongoose.model(
//       "PatientProfile"
//     );

//     const patientIds = appointments
//       .map(
//         (appointment) =>
//           appointment.patient?._id
//       )
//       .filter(Boolean);

//     const patientProfiles =
//       await PatientProfile.find({
//         user: {
//           $in: patientIds,
//         },
//       }).select(
//         "user dateOfBirth gender bloodGroup address"
//       );

//     // =====================================================
//     // CREATE PATIENT PROFILE MAP
//     // =====================================================

//     const patientProfileMap = {};

//     patientProfiles.forEach((profile) => {
//       patientProfileMap[
//         profile.user.toString()
//       ] = profile;
//     });

//     // =====================================================
//     // ADD PATIENT PROFILE INFORMATION
//     // =====================================================

//     const appointmentsWithPatientProfile =
//       appointments.map((appointment) => {
//         const patientId =
//           appointment.patient?._id?.toString();

//         const profile =
//           patientProfileMap[patientId];

//         return {
//           ...appointment.toObject(),

//           patient: appointment.patient
//             ? {
//                 ...appointment.patient.toObject(),

//                 dateOfBirth:
//                   profile?.dateOfBirth || null,

//                 gender:
//                   profile?.gender || "",

//                 bloodGroup:
//                   profile?.bloodGroup || "",

//                 address:
//                   profile?.address || null,
//               }
//             : null,
//         };
//       });

//     // =====================================================
//     // TIME-WISE SORT
//     // =====================================================

//     const parseTimeToMinutes = (time) => {
//       if (!time) return 999999;

//       const value = time
//         .toString()
//         .trim()
//         .toUpperCase();

//       // Example: 09:30 AM
//       const match = value.match(
//         /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/
//       );

//       if (!match) {
//         // Example: 09:30
//         const simpleMatch =
//           value.match(
//             /^(\d{1,2}):(\d{2})$/
//           );

//         if (simpleMatch) {
//           return (
//             parseInt(simpleMatch[1], 10) * 60 +
//             parseInt(simpleMatch[2], 10)
//           );
//         }

//         return 999999;
//       }

//       let hours =
//         parseInt(match[1], 10);

//       const minutes =
//         parseInt(match[2], 10);

//       const period =
//         match[3];

//       if (period === "AM" && hours === 12) {
//         hours = 0;
//       }

//       if (period === "PM" && hours !== 12) {
//         hours += 12;
//       }

//       return hours * 60 + minutes;
//     };

//     appointmentsWithPatientProfile.sort(
//       (a, b) => {
//         const timeA = parseTimeToMinutes(
//           a.startTime ||
//             a.slot?.startTime
//         );

//         const timeB = parseTimeToMinutes(
//           b.startTime ||
//             b.slot?.startTime
//         );

//         return timeA - timeB;
//       }
//     );

//     // =====================================================
//     // RESPONSE
//     // =====================================================

//     return res.status(200).json({
//       success: true,

//       count:
//         appointmentsWithPatientProfile.length,

//       appointments:
//         appointmentsWithPatientProfile,
//     });

//   } catch (error) {

//     console.error(
//       "Get doctor all today's appointments error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,

//       message:
//         "Failed to fetch today's appointments.",

//       error: error.message,
//     });
//   }
// };

// =====================================================
// GET ALL TODAY'S APPOINTMENTS FOR LOGGED-IN DOCTOR
// ALL STATUSES
// =====================================================

export const getDoctorAllTodayAppointments = async (req, res) => {
  try {
    // =====================================================
    // LOGGED-IN DOCTOR
    // =====================================================

    const doctorId = req.user.id || req.user._id;

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    // =====================================================
    // TODAY IN INDIA (ASIA/KOLKATA)
    // =====================================================

    const getIndiaDateParts = () => {
      const formatter = new Intl.DateTimeFormat(
        "en-CA",
        {
          timeZone: "Asia/Kolkata",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }
      );

      const parts = formatter.formatToParts(
        new Date()
      );

      const values = {};

      parts.forEach((part) => {
        if (part.type !== "literal") {
          values[part.type] = part.value;
        }
      });

      return values;
    };

    const {
      year,
      month,
      day,
    } = getIndiaDateParts();

    // =====================================================
    // START / END OF TODAY IN INDIA
    // Convert IST boundaries to UTC automatically
    // =====================================================

    const startOfToday = new Date(
      `${year}-${month}-${day}T00:00:00.000+05:30`
    );

    const startOfTomorrow = new Date(
      `${year}-${month}-${day}T00:00:00.000+05:30`
    );

    startOfTomorrow.setUTCDate(
      startOfTomorrow.getUTCDate() + 1
    );

    // =====================================================
    // GET ALL APPOINTMENTS FOR THIS DOCTOR TODAY
    //
    // IMPORTANT:
    // NO STATUS FILTER
    //
    // Shows:
    // Pending
    // Confirmed
    // Checked In
    // Completed
    // Cancelled
    // =====================================================

    const appointments =
      await Appointment.find({
        doctor: doctor._id,

        date: {
          $gte: startOfToday,
          $lt: startOfTomorrow,
        },
      })
        .populate(
          "patient",
          "name email phone"
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
    // GET PATIENT PROFILES
    // =====================================================

    const patientIds = appointments
      .map(
        (appointment) =>
          appointment.patient?._id
      )
      .filter(Boolean);

    const patientProfiles =
      await PatientProfile.find({
        user: {
          $in: patientIds,
        },
      }).select(
        "user dateOfBirth gender bloodGroup address"
      );

    // =====================================================
    // CREATE PROFILE MAP
    // =====================================================

    const patientProfileMap = {};

    patientProfiles.forEach((profile) => {
      patientProfileMap[
        profile.user.toString()
      ] = profile;
    });

    // =====================================================
    // ATTACH PATIENT PROFILE
    // =====================================================

    const appointmentsWithPatientProfile =
      appointments.map((appointment) => {
        const patientId =
          appointment.patient?._id?.toString();

        const profile =
          patientProfileMap[patientId];

        return {
          ...appointment.toObject(),

          patient: appointment.patient
            ? {
                ...appointment.patient.toObject(),

                dateOfBirth:
                  profile?.dateOfBirth || null,

                gender:
                  profile?.gender || "",

                bloodGroup:
                  profile?.bloodGroup || "",

                address:
                  profile?.address || null,
              }
            : null,
        };
      });

    // =====================================================
    // SORT BY TIME
    // =====================================================

    const parseTimeToMinutes = (time) => {
      if (!time) {
        return 999999;
      }

      const value = time
        .toString()
        .trim()
        .toUpperCase();

      // Example: 09:30 AM
      const match = value.match(
        /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/
      );

      if (!match) {
        // Example: 09:30
        const simpleMatch =
          value.match(
            /^(\d{1,2}):(\d{2})$/
          );

        if (simpleMatch) {
          return (
            parseInt(
              simpleMatch[1],
              10
            ) *
              60 +
            parseInt(
              simpleMatch[2],
              10
            )
          );
        }

        return 999999;
      }

      let hours =
        parseInt(match[1], 10);

      const minutes =
        parseInt(match[2], 10);

      const period =
        match[3];

      if (
        period === "AM" &&
        hours === 12
      ) {
        hours = 0;
      }

      if (
        period === "PM" &&
        hours !== 12
      ) {
        hours += 12;
      }

      return (
        hours * 60 +
        minutes
      );
    };

    appointmentsWithPatientProfile.sort(
      (a, b) => {
        const timeA =
          parseTimeToMinutes(
            a.startTime ||
              a.slot?.startTime
          );

        const timeB =
          parseTimeToMinutes(
            b.startTime ||
              b.slot?.startTime
          );

        return timeA - timeB;
      }
    );

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      count:
        appointmentsWithPatientProfile.length,

      appointments:
        appointmentsWithPatientProfile,
    });

  } catch (error) {
    console.error(
      "Get doctor all today's appointments error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch today's appointments.",

      error: error.message,
    });
  }
};
export const getDoctorPatients = async (req, res) => {
  try {
    const doctorId = req.user.id || req.user._id;

    // Make sure logged-in doctor exists
    const doctor = await Doctor.findById(doctorId).select("_id name");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Find all COMPLETED appointments for this doctor
    const completedAppointments = await Appointment.find({
      doctor: doctor._id,
      status: "Completed",
    })
      .populate("patient", "name email phone")
      .sort({ date: -1, startTime: -1 })
      .lean();

    // Remove duplicate patients
    const patientMap = new Map();

    completedAppointments.forEach((appointment) => {
      if (!appointment.patient?._id) return;

      const patientId = appointment.patient._id.toString();

      if (!patientMap.has(patientId)) {
        patientMap.set(patientId, {
          ...appointment.patient,

          // Latest completed appointment
          lastAppointment: {
            _id: appointment._id,
            date: appointment.date,
            day: appointment.day,
            startTime: appointment.startTime,
            endTime: appointment.endTime,
            reason: appointment.reason,
            fee: appointment.fee,
            status: appointment.status,
          },

          completedAppointments: 1,
        });
      } else {
        patientMap.get(patientId).completedAppointments += 1;
      }
    });

    const patients = Array.from(patientMap.values());

    // Get PatientProfile information
    const patientIds = patients.map((patient) => patient._id);

    const profiles = await PatientProfile.find({
      user: { $in: patientIds },
    })
      .select(
        "user dateOfBirth gender bloodGroup address"
      )
      .lean();

    const profileMap = new Map();

    profiles.forEach((profile) => {
      profileMap.set(profile.user.toString(), profile);
    });

    // Attach profile information
    const patientsWithProfile = patients.map((patient) => {
      const profile = profileMap.get(patient._id.toString());

      return {
        ...patient,

        dateOfBirth: profile?.dateOfBirth || null,
        gender: profile?.gender || "",
        bloodGroup: profile?.bloodGroup || "",
        address: profile?.address || null,
      };
    });

    return res.status(200).json({
      success: true,
      count: patientsWithProfile.length,
      patients: patientsWithProfile,
    });
  } catch (error) {
    console.error("Get doctor patients error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctor patients",
      error: error.message,
    });
  }
};