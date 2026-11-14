import PatientProfile from "../models/PatientProfile.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import Department from "../models/Department.js";
import Doctor from "../models/Doctor.js";
import Slot from "../models/Slot.js";
import Appointment from "../models/Appointment.js";
import MedicalRecord from "../models/MedicalRecord.js";
/* =====================================================
   GET PATIENT PROFILE
   GET /api/patient/profile
===================================================== */

export const getPatientProfile = async (req, res) => {
  try {

    console.log("REQ.USER:", req.user);

    const userId = req.user.id || req.user._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found in token",
      });
    }

    /*
     * IMPORTANT:
     * Name, email and phone come from User table.
     */

    const user = await User.findById(userId)
      .select("-password");

    console.log("USER FROM DATABASE:", user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    /*
     * Patient-specific information comes from
     * PatientProfile table.
     */

    let profile = await PatientProfile.findOne({
      user: userId,
    });

    /*
     * Create PatientProfile if it does not exist.
     */

    if (!profile) {

      profile = await PatientProfile.create({
        user: userId,
      });

    }

    return res.status(200).json({
      success: true,
      message: "Patient profile fetched successfully",

      /*
       * USER TABLE
       *
       * name
       * email
       * phone
       * role
       */

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },

      /*
       * PATIENT PROFILE TABLE
       *
       * dateOfBirth
       * gender
       * address
       * notificationPreferences
       * privacySettings
       * appointmentPreferences
       */

      profile,

    });

  } catch (error) {

    console.error(
      "Get patient profile error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch patient profile",
      error: error.message,
    });

  }
};


/* =====================================================
   UPDATE PERSONAL INFORMATION
   PUT /api/patient/profile
===================================================== */

export const updatePatientProfile = async (req, res) => {
  try {

    const userId = req.user._id;

    const {
      name,
      phone,
      email,
      dateOfBirth,
      gender,
      address,

  bloodGroup,
    } = req.body;


    /* =========================================
       UPDATE USER INFORMATION
    ========================================= */

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }


    if (name !== undefined) {
      user.name = name;
    }

    if (phone !== undefined) {
      user.phone = phone;
    }

    if (email !== undefined) {
      user.email = email;
    }


    await user.save();


    /* =========================================
       UPDATE PATIENT PROFILE
    ========================================= */

    const profile = await PatientProfile.findOneAndUpdate(
      {
        user: userId,
      },
      {
        dateOfBirth:
          dateOfBirth !== undefined
            ? dateOfBirth
            : undefined,

        gender:
          gender !== undefined
            ? gender
            : undefined,

        bloodGroup:
          bloodGroup !== undefined
            ? bloodGroup
            : undefined,

        address:
          address !== undefined
            ? address
            : undefined,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );


    const updatedUser = await User.findById(userId)
      .select("-password");


    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
      profile,
    });

  } catch (error) {

    console.error(
      "Update patient profile error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update patient profile",
      error: error.message,
    });
  }
};


/* =====================================================
   UPDATE NOTIFICATION PREFERENCES
   PUT /api/patient/profile/notifications
===================================================== */

export const updateNotificationPreferences = async (
  req,
  res
) => {

  try {

    const userId = req.user.id || req.user._id;


    if (!userId) {

      return res.status(401).json({
        success: false,
        message: "User ID not found",
      });

    }


    const {
      appointmentReminders,
      emailNotifications,
      prescriptionUpdates,
    } = req.body;


    /* =========================================
       FIND EXISTING PATIENT PROFILE
    ========================================= */

    let profile = await PatientProfile.findOne({
      user: userId,
    });


    /* =========================================
       CREATE PROFILE IF NOT EXISTS
    ========================================= */

    if (!profile) {

      profile = await PatientProfile.create({
        user: userId,
      });

    }


    /* =========================================
       UPDATE ONLY PROVIDED SETTINGS
    ========================================= */

    if (
      typeof appointmentReminders === "boolean"
    ) {

      profile.notificationPreferences
        .appointmentReminders =
        appointmentReminders;

    }


    if (
      typeof emailNotifications === "boolean"
    ) {

      profile.notificationPreferences
        .emailNotifications =
        emailNotifications;

    }


    if (
      typeof prescriptionUpdates === "boolean"
    ) {

      profile.notificationPreferences
        .prescriptionUpdates =
        prescriptionUpdates;

    }


    /* =========================================
       SAVE DATABASE
    ========================================= */

    await profile.save();


    return res.status(200).json({

      success: true,

      message:
        "Notification preferences updated",

      profile,

    });


  } catch (error) {

    console.error(
      "Notification preferences error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to update notification preferences",

      error: error.message,

    });

  }
};


/* =====================================================
   UPDATE PRIVACY SETTINGS
   PUT /api/patient/profile/privacy
===================================================== */


export const updatePrivacySettings = async (
  req,
  res
) => {

  try {

    const userId =
      req.user.id || req.user._id;


    if (!userId) {

      return res.status(401).json({
        success: false,
        message: "User ID not found",
      });

    }


    const {
      medicalRecordPrivacy,
      dataSharing,
    } = req.body;


    /* =========================================
       FIND EXISTING PROFILE
    ========================================= */

    let profile =
      await PatientProfile.findOne({
        user: userId,
      });


    /* =========================================
       CREATE PROFILE IF NOT EXISTS
    ========================================= */

    if (!profile) {

      profile =
        await PatientProfile.create({
          user: userId,
        });

    }


    /* =========================================
       MAKE SURE PRIVACY SETTINGS EXIST
    ========================================= */

    if (!profile.privacySettings) {

      profile.privacySettings = {

        medicalRecordPrivacy: true,

        dataSharing: false,

      };

    }


    /* =========================================
       UPDATE ONLY PROVIDED VALUES
    ========================================= */

    if (
      typeof medicalRecordPrivacy === "boolean"
    ) {

      profile.privacySettings
        .medicalRecordPrivacy =
        medicalRecordPrivacy;

    }


    if (
      typeof dataSharing === "boolean"
    ) {

      profile.privacySettings
        .dataSharing =
        dataSharing;

    }


    /* =========================================
       SAVE DATABASE
    ========================================= */

    await profile.save();


    return res.status(200).json({

      success: true,

      message:
        "Privacy settings updated",

      profile,

    });

  } catch (error) {

    console.error(
      "Privacy settings error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to update privacy settings",

      error: error.message,

    });

  }
};


/* =====================================================
   UPDATE APPOINTMENT PREFERENCES
   PUT /api/patient/profile/appointments
===================================================== */

export const updateAppointmentPreferences = async (
  req,
  res
) => {

  try {

    const userId =
      req.user.id || req.user._id;

    if (!userId) {

      return res.status(401).json({
        success: false,
        message: "User ID not found",
      });

    }


    const {
      preferredDepartment,
      reminderTime,
    } = req.body;


    /* =========================================
       FIND PROFILE
    ========================================= */

    let profile =
      await PatientProfile.findOne({
        user: userId,
      });


    /* =========================================
       CREATE PROFILE IF NOT EXISTS
    ========================================= */

    if (!profile) {

      profile =
        await PatientProfile.create({
          user: userId,
        });

    }


    /* =========================================
       MAKE SURE PREFERENCES EXIST
    ========================================= */

    if (!profile.appointmentPreferences) {

      profile.appointmentPreferences = {};

    }


    /* =========================================
       UPDATE ONLY PROVIDED VALUES
    ========================================= */

    if (
      preferredDepartment !== undefined
    ) {

      profile.appointmentPreferences
        .preferredDepartment =
        preferredDepartment;

    }


    if (
      reminderTime !== undefined
    ) {

      profile.appointmentPreferences
        .reminderTime =
        reminderTime;

    }


    /* =========================================
       SAVE
    ========================================= */

    await profile.save();


    return res.status(200).json({

      success: true,

      message:
        "Appointment preferences updated",

      profile,

    });

  } catch (error) {

    console.error(
      "Appointment preferences error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to update appointment preferences",

      error: error.message,

    });

  }
};
/* =====================================================
   DELETE PATIENT ACCOUNT
   DELETE /api/patient/account
===================================================== */

export const deletePatientAccount = async (req, res) => {

  try {

    const userId =
      req.user.id || req.user._id;


    if (!userId) {

      return res.status(401).json({
        success: false,
        message: "User ID not found",
      });

    }


    /* =========================================
       DELETE PATIENT PROFILE
    ========================================= */

    await PatientProfile.findOneAndDelete({
      user: userId,
    });


    /* =========================================
       DELETE USER ACCOUNT
    ========================================= */

    const deletedUser =
      await User.findByIdAndDelete(userId);


    if (!deletedUser) {

      return res.status(404).json({
        success: false,
        message: "Patient account not found",
      });

    }


    /* =========================================
       SUCCESS
    ========================================= */

    return res.status(200).json({

      success: true,

      message:
        "Patient account deleted successfully",

    });

  } catch (error) {

    console.error(
      "Delete patient account error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to delete patient account",

      error: error.message,

    });

  }

};
/* =====================================================
   CHANGE PATIENT PASSWORD
   PUT /api/patient/change-password
===================================================== */

export const changePatientPassword = async (
  req,
  res
) => {

  try {

    const userId =
      req.user.id || req.user._id;


    if (!userId) {

      return res.status(401).json({
        success: false,
        message: "User ID not found",
      });

    }


    const {
      currentPassword,
      newPassword,
    } = req.body;


    /* =========================================
       VALIDATION
    ========================================= */

    if (!currentPassword || !newPassword) {

      return res.status(400).json({
        success: false,
        message:
          "Current password and new password are required",
      });

    }


    if (newPassword.length < 6) {

      return res.status(400).json({
        success: false,
        message:
          "New password must be at least 6 characters",
      });

    }


    /* =========================================
       FIND USER
    ========================================= */

    const user =
      await User.findById(userId);


    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    }


    /* =========================================
       CHECK CURRENT PASSWORD
    ========================================= */

    const isPasswordCorrect =
      await bcrypt.compare(
        currentPassword,
        user.password
      );


    if (!isPasswordCorrect) {

      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });

    }


    /* =========================================
       HASH NEW PASSWORD
    ========================================= */

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );


    user.password =
      hashedPassword;


    await user.save();


    /* =========================================
       SUCCESS
    ========================================= */

    return res.status(200).json({

      success: true,

      message:
        "Password changed successfully",

    });

  } catch (error) {

    console.error(
      "Change password error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to change password",

      error: error.message,

    });

  }

};

export const getDepartments = async (req, res) => {
  try {

    const departments = await Department.find({
      status: "Active",
    }).sort({
      name: 1,
    });

    return res.status(200).json({
      success: true,
      departments,
    });

  } catch (error) {

    console.error(
      "Get departments error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch departments",
      error: error.message,
    });

  }
};



/* =====================================================
   GET DOCTORS BY DEPARTMENT
   GET /api/patient/doctors?department=Cardiology
===================================================== */

export const getDoctorsByDepartment = async (
  req,
  res
) => {

  try {

    const { department } = req.query;



    if (!department) {

      return res.status(400).json({

        success: false,

        message: "Department is required",

      });

    }


    console.log(
      "Searching doctors for department:",
      department
    );

    const doctors = await Doctor.find({

      department: department,

      status: "Active",

    })
    .select("-password")
    .sort({
      name: 1,
    });


    console.log(
      "Doctors found:",
      doctors
    );

    return res.status(200).json({

      success: true,

      doctors,

    });


  } catch (error) {

    console.error(
      "Get doctors by department error:",
      error
    );

    return res.status(500).json({

      success: false,

      message: "Failed to fetch doctors",

      error: error.message,

    });

  }

};

/* =====================================================
   GET DOCTOR SLOTS
   GET /api/patient/doctors/:doctorId/slots?date=YYYY-MM-DD
===================================================== */

// export const getDoctorSlots = async (req, res) => {

//   try {

//     const {
//       doctorId,
//     } = req.params;

//     const {
//       date,
//     } = req.query;


//     /* =========================================
//        VALIDATE DATE
//     ========================================= */

//     if (!date) {

//       return res.status(400).json({

//         success: false,

//         message: "Date is required",

//       });

//     }


//     /* =========================================
//        CHECK DOCTOR
//     ========================================= */

//     const doctor = await Doctor.findById(
//       doctorId
//     ).select("-password");


//     if (!doctor) {

//       return res.status(404).json({

//         success: false,

//         message: "Doctor not found",

//       });

//     }


//     /* =========================================
//        START / END OF SELECTED DATE
//     ========================================= */

//     const startDate = new Date(
//       `${date}T00:00:00.000`
//     );

//     const endDate = new Date(
//       `${date}T23:59:59.999`
//     );


//     /* =========================================
//        FIND SLOTS
//     ========================================= */

//     const slots = await Slot.find({

//       doctor: doctorId,

//       date: {
//         $gte: startDate,
//         $lte: endDate,
//       },

//     })
//     .sort({
//       startTime: 1,
//     });


//     return res.status(200).json({

//       success: true,

//       doctor,

//       date,

//       slots,

//     });

//   } catch (error) {

//     console.error(
//       "Get doctor slots error:",
//       error
//     );


//     return res.status(500).json({

//       success: false,

//       message:
//         "Failed to fetch doctor availability",

//       error: error.message,

//     });

//   }

// };

export const getDoctorSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    /* =========================================
       VALIDATE DATE
    ========================================= */

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    /* =========================================
       CHECK DOCTOR
    ========================================= */

    const doctor = await Doctor.findById(doctorId).select("-password");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    /* =========================================
       START / END OF SELECTED DATE
    ========================================= */

    const startDate = new Date(`${date}T00:00:00.000`);
    const endDate = new Date(`${date}T23:59:59.999`);

    if (
      isNaN(startDate.getTime()) ||
      isNaN(endDate.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid date",
      });
    }

    /* =========================================
       FIND SLOTS
    ========================================= */

    const slots = await Slot.find({
      doctor: doctorId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({
      startTime: 1,
    });

    /* =========================================
       FILTER PAST SLOTS FOR TODAY
    ========================================= */

    const now = new Date();

    const todayString =
      `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${String(
        now.getDate()
      ).padStart(2, "0")}`;

    const isToday = date === todayString;

    const filteredSlots = slots.filter((slot) => {

      /*
       * Future dates:
       * Show every slot.
       */
      if (!isToday) {
        return true;
      }

      /*
       * Today:
       * Compare slot start time with current time.
       */

      const [hours, minutes] = slot.startTime
        .split(":")
        .map(Number);

      const slotDateTime = new Date();

      slotDateTime.setHours(
        hours,
        minutes,
        0,
        0
      );

      /*
       * Strictly greater than current time.
       *
       * Example:
       * Current = 3:00 PM
       *
       * 2:30 PM -> hidden
       * 3:00 PM -> hidden
       * 3:30 PM -> shown
       */
      return slotDateTime > now;
    });

    /* =========================================
       RESPONSE
    ========================================= */

    return res.status(200).json({
      success: true,
      doctor,
      date,
      slots: filteredSlots,
    });

  } catch (error) {

    console.error(
      "Get doctor slots error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctor availability",
      error: error.message,
    });
  }
};


// =====================================================
// PATIENT DASHBOARD STATS
// =====================================================



export const getPatientDashboardStats = async (req, res) => {
  try {
    if (req.user?.role !== "patient") {
      return res.status(403).json({
        success: false,
        message: "Patient access required.",
      });
    }

    const patientId = req.user.id || req.user._id;

    if (!patientId) {
      return res.status(401).json({
        success: false,
        message: "Patient ID not found.",
      });
    }

    const now = new Date();

    // =====================================================
    // UPCOMING APPOINTMENTS
    // =====================================================

    const upcomingCount =
      await Appointment.countDocuments({
        patient: patientId,
        date: {
          $gte: now,
        },
        status: {
          $in: [
            "Pending",
            "Confirmed",
            "Checked In",
          ],
        },
      });

    // =====================================================
    // COMPLETED APPOINTMENTS
    // =====================================================

    const completedCount =
      await Appointment.countDocuments({
        patient: patientId,
        status: "Completed",
      });

    // =====================================================
    // GET MEDICAL RECORDS
    // =====================================================

    const medicalRecords =
      await MedicalRecord.find({
        patient: patientId,
      })
        .select("prescriptions")
        .lean();

    // =====================================================
    // MEDICAL RECORD COUNT
    // =====================================================

    const recordsCount =
      medicalRecords.length;

    // =====================================================
    // PRESCRIPTION COUNT
    // =====================================================

    const prescriptionsCount =
      medicalRecords.reduce(
        (total, record) => {
          const prescriptions =
            Array.isArray(record.prescriptions)
              ? record.prescriptions
              : [];

          const validPrescriptions =
            prescriptions.filter(
              (prescription) =>
                prescription?.medicineName?.trim()
            );

          return (
            total +
            validPrescriptions.length
          );
        },
        0
      );

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      stats: {
        upcoming: upcomingCount,
        completed: completedCount,

        records: recordsCount,

        prescriptions:
          prescriptionsCount,
      },
    });

  } catch (error) {
    console.error(
      "Get patient dashboard stats error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch patient dashboard stats.",
      error: error.message,
    });
  }
};

