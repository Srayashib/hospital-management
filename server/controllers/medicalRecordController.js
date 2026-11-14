import mongoose from "mongoose";
import MedicalRecord from "../models/MedicalRecord.js";
import Appointment from "../models/Appointment.js";
import PatientProfile from "../models/PatientProfile.js";
import Doctor from "../models/Doctor.js";

/* =====================================================
   COMPLETE APPOINTMENT
   POST /api/doctors/appointments/:appointmentId/complete
===================================================== */

export const completeAppointment = async (req, res) => {

  try {

    const doctorId =
      req.user.id || req.user._id;

    const { appointmentId } =
      req.params;


    /* =================================================
       REQUEST DATA
    ================================================= */

    const {

      diagnosis,

      clinicalFindings,

      bloodTestName,

      bloodTestResult,

      prescriptions,

      treatmentNotes,

      remarks,

      followUpRequired,

      followUpDate,

    } = req.body;


    /* =================================================
       FIND APPOINTMENT
    ================================================= */

    const appointment =
      await Appointment.findById(
        appointmentId
      );


    if (!appointment) {

      return res.status(404).json({

        success: false,

        message:
          "Appointment not found",

      });

    }


    /* =================================================
       SECURITY CHECK
    ================================================= */

    if (
      appointment.doctor.toString() !==
      doctorId.toString()
    ) {

      return res.status(403).json({

        success: false,

        message:
          "You are not authorized to complete this appointment",

      });

    }


    /* =================================================
       STATUS CHECK
    ================================================= */

    if (
      appointment.status !==
      "Checked In"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Only checked-in appointments can be completed",

      });

    }


    /* =================================================
       PATIENT PROFILE
    ================================================= */

    const patientProfile =
      await PatientProfile.findOne({

        user: appointment.patient,

      });


    if (!patientProfile) {

      return res.status(404).json({

        success: false,

        message:
          "Patient profile not found",

      });

    }


    /* =================================================
       DUPLICATE CHECK
    ================================================= */

    const existingRecord =
      await MedicalRecord.findOne({

        appointment:
          appointment._id,

      });


    if (existingRecord) {

      return res.status(400).json({

        success: false,

        message:
          "Medical record already exists for this appointment",

      });

    }


    /* =================================================
       PARSE PRESCRIPTIONS
    ================================================= */

    let parsedPrescriptions = [];


    if (prescriptions) {

      try {

        parsedPrescriptions =
          typeof prescriptions === "string"
            ? JSON.parse(prescriptions)
            : prescriptions;


        if (
          !Array.isArray(
            parsedPrescriptions
          )
        ) {

          parsedPrescriptions = [];

        }

      } catch (error) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid prescription data",

        });

      }

    }


    /* =================================================
       FILE INFORMATION
    ================================================= */

    const files =
      req.files || {};


    let prescriptionDocument = {
      path: "",
      originalName: "",
      mimeType: "",
      size: 0,
    };


    let labReportDocument = {
      path: "",
      originalName: "",
      mimeType: "",
      size: 0,
    };


    let otherMedicalDocument = {
      path: "",
      originalName: "",
      mimeType: "",
      size: 0,
    };


    /* =================================================
       PRESCRIPTION FILE
    ================================================= */

    if (
      files.prescriptionFile &&
      files.prescriptionFile[0]
    ) {

      const file =
        files.prescriptionFile[0];


      prescriptionDocument = {

        path:
          `/uploads/medical-records/prescriptions/${file.filename}`,

        originalName:
          file.originalname,

        mimeType:
          file.mimetype,

        size:
          file.size,

      };

    }


    /* =================================================
       LAB REPORT FILE
    ================================================= */

    if (
      files.labReportFile &&
      files.labReportFile[0]
    ) {

      const file =
        files.labReportFile[0];


      labReportDocument = {

        path:
          `/uploads/medical-records/lab-reports/${file.filename}`,

        originalName:
          file.originalname,

        mimeType:
          file.mimetype,

        size:
          file.size,

      };

    }


    /* =================================================
       OTHER MEDICAL DOCUMENT
    ================================================= */

    if (
      files.otherMedicalFile &&
      files.otherMedicalFile[0]
    ) {

      const file =
        files.otherMedicalFile[0];


      otherMedicalDocument = {

        path:
          `/uploads/medical-records/other/${file.filename}`,

        originalName:
          file.originalname,

        mimeType:
          file.mimetype,

        size:
          file.size,

      };

    }


    /* =================================================
       CREATE MEDICAL RECORD
    ================================================= */

    const medicalRecord =
      await MedicalRecord.create({

        patient:
          appointment.patient,

        doctor:
          appointment.doctor,

        appointment:
          appointment._id,


        /* ---------------------------------------------
           CLINICAL
        --------------------------------------------- */

        diagnosis:
          diagnosis || "",


        clinicalFindings:
          clinicalFindings || "",


        /* ---------------------------------------------
           BLOOD TEST
        --------------------------------------------- */

        bloodTest: {

          name:
            bloodTestName || "",

          result:
            bloodTestResult || "",

        },


        /* ---------------------------------------------
           PRESCRIPTIONS
        --------------------------------------------- */

        prescriptions:
          parsedPrescriptions,


        /* ---------------------------------------------
           NOTES
        --------------------------------------------- */

        treatmentNotes:
          treatmentNotes || "",


        remarks:
          remarks || "",


        /* ---------------------------------------------
           FOLLOW UP
        --------------------------------------------- */

        followUp: {

          required:
            followUpRequired === true ||
            followUpRequired === "true",

          date:
            followUpDate
              ? new Date(followUpDate)
              : null,

        },


        /* ---------------------------------------------
           DOCUMENTS
        --------------------------------------------- */

        documents: {

          prescription:
            prescriptionDocument,

          labReport:
            labReportDocument,

          otherMedicalDocument:
            otherMedicalDocument,

        },

      });


    /* =================================================
       UPDATE APPOINTMENT
    ================================================= */

    appointment.status =
      "Completed";


    await appointment.save();


    /* =================================================
       RESPONSE
    ================================================= */

    return res.status(200).json({

      success: true,

      message:
        "Appointment completed successfully",

      appointment,

      medicalRecord,

    });


  } catch (error) {

    console.error(
      "Complete appointment error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to complete appointment",

      error:
        error.message,

    });

  }

};
/* =====================================================
   GET MY MEDICAL HISTORY
   GET /api/patient/medical-history
===================================================== */

export const getMyMedicalHistory = async (req, res) => {
  try {

    const patientId =
      req.user.id || req.user._id;


    /* =================================================
       GET PATIENT APPOINTMENTS
    ================================================= */

    const appointments =
      await Appointment.find({
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


    /* =================================================
       GET MEDICAL RECORDS
    ================================================= */

    const appointmentIds =
      appointments.map(
        (appointment) => appointment._id
      );


    const medicalRecords =
      await MedicalRecord.find({
        patient: patientId,
        appointment: {
          $in: appointmentIds,
        },
      })
        .lean();


    /* =================================================
       CREATE MEDICAL RECORD MAP
    ================================================= */

    const medicalRecordMap = {};

    medicalRecords.forEach((record) => {

      medicalRecordMap[
        record.appointment.toString()
      ] = record;

    });


    /* =================================================
       COMBINE APPOINTMENT + MEDICAL RECORD
    ================================================= */

    const history =
      appointments.map((appointment) => {

        const record =
          medicalRecordMap[
            appointment._id.toString()
          ] || null;


        return {
          ...appointment,

          medicalRecord: record,
        };

      });


    /* =================================================
       RESPONSE
    ================================================= */

    return res.status(200).json({

      success: true,

      count: history.length,

      appointments: history,

    });


  } catch (error) {

    console.error(
      "Get patient medical history error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch medical history",

      error:
        error.message,

    });

  }
};

/* =====================================================
   GET MEDICAL RECORD FOR APPOINTMENT
   GET /api/doctors/appointments/:appointmentId/medical-record
===================================================== */

export const getMedicalRecordByAppointment = async (req, res) => {
  try {
    const doctorId = req.user.id || req.user._id;
    const { appointmentId } = req.params;

    /* =========================================
       FIND APPOINTMENT
    ========================================= */

    const appointment = await Appointment.findById(appointmentId)
      .populate("patient", "name email phone");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    /* =========================================
       MAKE SURE APPOINTMENT BELONGS TO DOCTOR
    ========================================= */

    if (appointment.doctor.toString() !== doctorId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this medical record.",
      });
    }

    /* =========================================
       FIND MEDICAL RECORD
    ========================================= */

    const medicalRecord = await MedicalRecord.findOne({
      appointment: appointmentId,
      patient: appointment.patient._id,
      doctor: doctorId,
    }).lean();

    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: "Medical record has not been created for this appointment.",
      });
    }

    /* =========================================
       RESPONSE
    ========================================= */

    return res.status(200).json({
      success: true,
      appointment,
      medicalRecord,
    });

  } catch (error) {
    console.error(
      "Get medical record by appointment error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch medical record.",
      error: error.message,
    });
  }
};
export const getDoctorPatientMedicalHistory = async (req, res) => {
  try {
    const doctorId = req.user.id || req.user._id;
    const { patientId } = req.params;

    /*
     * =====================================================
     * FIND DOCTOR
     * =====================================================
     */

    const Doctor = mongoose.model("Doctor");

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }


    /*
     * =====================================================
     * FIND PATIENT
     * =====================================================
     */

    const User = mongoose.model("User");

    const patientUser = await User.findById(patientId)
      .select("name patientId email phone");

    if (!patientUser) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }


    /*
     * =====================================================
     * FIND PATIENT PROFILE
     * =====================================================
     */

    const PatientProfile =
      mongoose.model("PatientProfile");

    const patientProfile =
      await PatientProfile.findOne({
        user: patientId,
      }).lean();


    /*
     * =====================================================
     * PATIENT OBJECT
     * =====================================================
     */

    const patient = {

      _id: patientUser._id,

      patientId:
        patientUser.patientId ||
        patientUser._id,

      name:
        patientUser.name ||
        "N/A",

      email:
        patientUser.email ||
        "N/A",

      phone:
        patientUser.phone ||
        "N/A",

      dateOfBirth:
        patientProfile?.dateOfBirth ||
        null,

      gender:
        patientProfile?.gender ||
        "",

      bloodGroup:
        patientProfile?.bloodGroup ||
        "",

      address:
        patientProfile?.address ||
        {},
      latestVitals:
        patientProfile?.latestVitals || {
          bloodPressure: "",
          heartRate: null,
          weight: null,
          bloodSugar: null,
          updatedAt: null,
        },

    };


    /*
     * =====================================================
     * FIND ONLY THIS DOCTOR + THIS PATIENT APPOINTMENTS
     * =====================================================
     */

    const appointments =
      await Appointment.find({
        patient: patientId,
        doctor: doctor._id,
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


    /*
     * =====================================================
     * FIND MEDICAL RECORDS
     * =====================================================
     */

    const appointmentIds =
      appointments.map(
        (appointment) =>
          appointment._id
      );


    const medicalRecords =
      await MedicalRecord.find({
        patient: patientId,
        doctor: doctor._id,
        appointment: {
          $in: appointmentIds,
        },
      }).lean();


    /*
     * =====================================================
     * MAP MEDICAL RECORDS BY APPOINTMENT
     * =====================================================
     */

    const medicalRecordMap = {};

    medicalRecords.forEach(
      (record) => {

        medicalRecordMap[
          record.appointment.toString()
        ] = record;

      }
    );


    /*
     * =====================================================
     * ATTACH MEDICAL RECORD TO APPOINTMENT
     * =====================================================
     */

    const history =
      appointments.map(
        (appointment) => ({

          ...appointment,

          medicalRecord:
            medicalRecordMap[
              appointment._id.toString()
            ] || null,

        })
      );


    /*
     * =====================================================
     * RESPONSE
     * =====================================================
     */

    return res.status(200).json({

      success: true,

      patient,

      count: history.length,

      appointments: history,

    });

  } catch (error) {

    console.error(
      "Get doctor patient medical history error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch patient medical history",

      error: error.message,

    });

  }
};
// =====================================================
// UPDATE PATIENT LATEST VITALS
// PUT /api/doctors/patients/:patientId/vitals
// =====================================================

export const updatePatientVitals = async (req, res) => {
  try {
    const doctorId =
      req.user.id || req.user._id;

    const { patientId } = req.params;

    // =====================================================
    // CHECK USER ROLE
    // =====================================================

    if (req.user?.role !== "doctor") {
      return res.status(403).json({
        success: false,
        message: "Doctor access required.",
      });
    }

    // =====================================================
    // CHECK DOCTOR
    // =====================================================

    const doctor =
      await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    // =====================================================
    // MAKE SURE THIS DOCTOR HAS THIS PATIENT
    // =====================================================

    const appointment =
      await Appointment.findOne({
        doctor: doctorId,
        patient: patientId,
      });

    if (!appointment) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to update this patient's information.",
      });
    }

    // =====================================================
    // REQUEST DATA
    // =====================================================

    const {
      bloodPressure,
      heartRate,
      weight,
      bloodSugar,
    } = req.body;

    // =====================================================
    // FIND / CREATE PATIENT PROFILE
    // =====================================================

    let patientProfile =
      await PatientProfile.findOne({
        user: patientId,
      });

    if (!patientProfile) {
      patientProfile =
        await PatientProfile.create({
          user: patientId,
        });
    }

    // =====================================================
    // MAKE SURE LATEST VITALS EXIST
    // =====================================================

    if (!patientProfile.latestVitals) {
      patientProfile.latestVitals = {};
    }

    // =====================================================
    // BLOOD PRESSURE
    // =====================================================

    if (bloodPressure !== undefined) {
      patientProfile.latestVitals.bloodPressure =
        String(bloodPressure).trim();
    }

    // =====================================================
    // HEART RATE
    // =====================================================

    if (heartRate !== undefined) {
      patientProfile.latestVitals.heartRate =
        heartRate === ""
          ? null
          : Number(heartRate);
    }

    // =====================================================
    // WEIGHT
    // =====================================================

    if (weight !== undefined) {
      patientProfile.latestVitals.weight =
        weight === ""
          ? null
          : Number(weight);
    }

    // =====================================================
    // BLOOD SUGAR
    // =====================================================

    if (bloodSugar !== undefined) {
      patientProfile.latestVitals.bloodSugar =
        bloodSugar === ""
          ? null
          : Number(bloodSugar);
    }

    // =====================================================
    // UPDATED TIME
    // =====================================================

    patientProfile.latestVitals.updatedAt =
      new Date();

    await patientProfile.save();

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,
      message:
        "Patient latest information updated successfully.",

      latestVitals:
        patientProfile.latestVitals,
    });

  } catch (error) {
    console.error(
      "Update patient vitals error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update patient latest information.",
      error: error.message,
    });
  }
};