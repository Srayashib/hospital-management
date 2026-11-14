import React, { useEffect, useState } from "react";
import {
  FiUser,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiPhone,
  FiMail,
  FiActivity,
  FiFileText,
  FiDownload,
  FiChevronDown,
  FiHeart,
  FiUserCheck,
  FiClipboard,
  FiAlertCircle,
  FiEdit3,
FiSave,
} from "react-icons/fi";

import { useParams, useNavigate } from "react-router-dom";

import {
  getDoctorPatientMedicalHistory,
  updatePatientVitals,
} from "../../services/doctorService";

const MedicalRecord = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);

  const [loadingPatient, setLoadingPatient] = useState(true);
  const [patientError, setPatientError] = useState("");

  const [appointments, setAppointments] = useState([]);

  const [loadingAppointments, setLoadingAppointments] =
    useState(true);

  const [appointmentError, setAppointmentError] =
    useState("");

  const [selectedAppointmentId, setSelectedAppointmentId] =
    useState("");

  const [dropdownOpen, setDropdownOpen] =
    useState(false);
  const [vitalsModalOpen, setVitalsModalOpen] =
    useState(false);

  const [vitalsSaving, setVitalsSaving] =
    useState(false);

  const [vitalsError, setVitalsError] =
    useState("");

  const [vitalsForm, setVitalsForm] = useState({
    bloodPressure: "",
    heartRate: "",
    weight: "",
    bloodSugar: "",
  });

  /*
   * =====================================================
   * FETCH DOCTOR-SPECIFIC PATIENT MEDICAL HISTORY
   * =====================================================
   *
   * Backend should return:
   *
   * {
   *   success: true,
   *   patient: {...},
   *   appointments: [...]
   * }
   *
   * appointments must contain only:
   *
   * current doctor + selected patient
   */

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      try {
        setLoadingAppointments(true);

        setAppointmentError("");

        const response =
          await getDoctorPatientMedicalHistory(patientId);

        console.log(
          "Doctor patient medical history:",
          response
        );

        /*
         * -----------------------------------------------
         * PATIENT INFORMATION
         * -----------------------------------------------
         */

        const backendPatient =
          response?.patient || {};

        setPatient({
          name:
            backendPatient.name ||
            "N/A",

          patientId:
            backendPatient.patientId ||
            backendPatient._id ||
            patientId ||
            "N/A",

          email:
            backendPatient.email ||
            "N/A",

          phone:
            backendPatient.phone ||
            "N/A",

          dateOfBirth:
            backendPatient.dateOfBirth
              ? new Date(
                  backendPatient.dateOfBirth
                ).toLocaleDateString(
                  "en-US",
                  {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }
                )
              : "N/A",

          gender:
            backendPatient.gender ||
            "N/A",

          bloodGroup:
            backendPatient.bloodGroup ||
            "N/A",

          address: [
            backendPatient.address?.street,
            backendPatient.address?.city,
            backendPatient.address?.state,
            backendPatient.address?.zipCode,
            backendPatient.address?.country,
          ]
            .filter(Boolean)
            .join(", ") || "N/A",
          latestVitals:
            backendPatient.latestVitals || {
              bloodPressure: "",
              heartRate: null,
              weight: null,
              bloodSugar: null,
              updatedAt: null,
            },
        });

        /*
         * -----------------------------------------------
         * APPOINTMENTS
         * -----------------------------------------------
         */

        const history =
          Array.isArray(response)
            ? response
            : response?.appointments || [];

        /*
         * Newest appointment first
         */

        const sortedHistory =
          [...history].sort(
            (a, b) =>
              new Date(b.date) -
              new Date(a.date)
          );

        setAppointments(sortedHistory);

        /*
         * Automatically select newest appointment
         */

        if (sortedHistory.length > 0) {
          setSelectedAppointmentId(
            sortedHistory[0]._id
          );
        }
      } catch (error) {
        console.error(
          "Failed to fetch doctor patient medical history:",
          error
        );

        setAppointmentError(
          error.response?.data?.message ||
            "Failed to load patient medical history."
        );
      } finally {
        setLoadingAppointments(false);
        setLoadingPatient(false);
      }
    };

    if (patientId) {
      fetchMedicalHistory();
    }
  }, [patientId]);

  /*
   * =====================================================
   * SELECTED APPOINTMENT
   * =====================================================
   */

  const selectedAppointment =
    appointments.find(
      (appointment) =>
        appointment._id ===
        selectedAppointmentId
    ) || appointments[0];

  /*
   * Medical record belonging to selected appointment
   */

  const record =
    selectedAppointment?.medicalRecord;

  /*
   * =====================================================
   * SELECT APPOINTMENT
   * =====================================================
   */

  const selectAppointment = (id) => {
    setSelectedAppointmentId(id);
    setDropdownOpen(false);
  };

  /*
   * =====================================================
   * LOADING
   * =====================================================
   */
// =====================================================
// OPEN VITALS MODAL
// =====================================================

const openVitalsModal = () => {
  setVitalsError("");

  const currentVitals =
    patient?.latestVitals || {};

  setVitalsForm({
    bloodPressure:
      currentVitals.bloodPressure || "",

    heartRate:
      currentVitals.heartRate ?? "",

    weight:
      currentVitals.weight ?? "",

    bloodSugar:
      currentVitals.bloodSugar ?? "",
  });

  setVitalsModalOpen(true);
};


// =====================================================
// INPUT CHANGE
// =====================================================

const handleVitalsChange = (e) => {
  const {
    name,
    value,
  } = e.target;

  setVitalsForm((prev) => ({
    ...prev,
    [name]: value,
  }));
};


// =====================================================
// SAVE VITALS
// =====================================================

const handleSaveVitals = async (e) => {
  e.preventDefault();

  try {
    setVitalsSaving(true);
    setVitalsError("");

    const response =
      await updatePatientVitals(
        patientId,
        vitalsForm
      );

    if (!response?.success) {
      throw new Error(
        response?.message ||
          "Failed to update patient information."
      );
    }

    const updatedVitals =
      response.latestVitals || {
        ...vitalsForm,
      };

    setPatient((prev) => ({
      ...prev,
      latestVitals: updatedVitals,
    }));

    setVitalsModalOpen(false);

  } catch (error) {
    console.error(
      "Failed to update patient vitals:",
      error
    );

    setVitalsError(
      error?.response?.data?.message ||
        error.message ||
        "Failed to update patient information."
    );
  } finally {
    setVitalsSaving(false);
  }
};
  if (
    loadingPatient ||
    loadingAppointments
  ) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

        <div className="max-w-7xl mx-auto">

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">

            <div className="flex items-center justify-center">

              <div className="w-8 h-8 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin" />

            </div>

            <p className="text-center text-sm text-slate-500 mt-4">
              Loading patient medical history...
            </p>

          </div>

        </div>

      </div>
    );
  }

  /*
   * =====================================================
   * ERROR
   * =====================================================
   */

  if (
    patientError ||
    appointmentError
  ) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

        <div className="max-w-7xl mx-auto">

          <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-6">

            <div className="flex items-center gap-3 text-red-600">

              <FiAlertCircle size={22} />

              <p className="text-sm font-semibold">
                {patientError ||
                  appointmentError}
              </p>

            </div>

          </div>

        </div>

      </div>
    );
  }

  /*
   * =====================================================
   * NO APPOINTMENTS
   * =====================================================
   */

  if (!appointments.length) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

        <div className="max-w-7xl mx-auto">

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">

            <div className="flex flex-col items-center justify-center text-center">

              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mb-4">
                <FiFileText size={24} />
              </div>

              <h3 className="text-lg font-semibold text-slate-800">
                No Appointment History
              </h3>

              <p className="text-sm text-slate-500 mt-2">
                No appointment history was found for this patient with this doctor.
              </p>

            </div>

          </div>

        </div>

      </div>
    );
  }

  /*
   * =====================================================
   * PAGE
   * =====================================================
   */

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

      <div className="max-w-7xl mx-auto">

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <div className="mb-6">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 mb-4 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-sky-300 hover:text-sky-600 transition shadow-sm"
          >
            <span className="text-lg leading-none">←</span>
            Back to Appointments
          </button>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Patient Medical Record
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            View this patient's appointments and medical records for your visits.
          </p>

        </div>


        {/* =====================================================
            PATIENT INFORMATION
        ===================================================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6">

          <div className="p-5 sm:p-6">

            <div className="flex flex-col lg:flex-row lg:items-center gap-5">

              {/* Avatar */}

              <div className="w-20 h-20 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">

                <FiUser size={38} />

              </div>


              {/* Name + Contact */}

              <div className="flex-1">

                <div className="flex flex-wrap items-center gap-3">

                  <h2 className="text-xl font-bold text-slate-900">
                    {patient?.name || "N/A"}
                  </h2>

                  <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold">
                    {patient?.patientId || "N/A"}
                  </span>

                </div>


                <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 text-sm text-slate-500">

                  <span className="flex items-center gap-2">

                    <FiMail />

                    {patient?.email || "N/A"}

                  </span>


                  <span className="flex items-center gap-2">

                    <FiPhone />

                    {patient?.phone || "N/A"}

                  </span>

                </div>

              </div>


              {/* Basic Details */}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

                <div>

                  <p className="text-xs text-slate-400">
                    Date of Birth
                  </p>

                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {patient?.dateOfBirth || "N/A"}
                  </p>

                </div>


                <div>

                  <p className="text-xs text-slate-400">
                    Gender
                  </p>

                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {patient?.gender || "N/A"}
                  </p>

                </div>


                <div>

                  <p className="text-xs text-slate-400">
                    Blood Group
                  </p>

                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {patient?.bloodGroup || "N/A"}
                  </p>

                </div>

              </div>

            </div>


            {/* Address */}

            <div className="mt-5 pt-5 border-t border-slate-100">

              <div className="flex items-start gap-2 text-sm text-slate-600">

                <FiMapPin className="text-sky-500 mt-0.5 shrink-0" />

                <span>
                  {patient?.address || "N/A"}
                </span>

              </div>

            </div>

          </div>

        </div>
{/* =====================================================
    LATEST INFORMATION
===================================================== */}

<div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6">

  <div className="p-5 sm:p-6 border-b border-slate-100">

    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

      <div>

        <h2 className="text-lg font-bold text-slate-900">
          Latest Information
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Latest patient vital information.
        </p>

      </div>

      <button
        type="button"
        onClick={openVitalsModal}
        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 text-white rounded-xl text-sm font-semibold hover:bg-sky-700 transition"
      >
        <FiEdit3 />
        Update Information
      </button>

    </div>

  </div>


  <div className="p-5 sm:p-6">

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

      {/* BLOOD PRESSURE */}

      <div className="rounded-xl bg-slate-50 border border-slate-100 p-5">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
            <FiHeart />
          </div>

          <div>

            <p className="text-xs text-slate-400">
              Blood Pressure
            </p>

            <div className="mt-1 flex items-baseline gap-1">

              <strong className="text-xl font-bold text-slate-900">
                {patient?.latestVitals?.bloodPressure || "--"}
              </strong>

              <span className="text-xs text-slate-400">
                mmHg
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* HEART RATE */}

      <div className="rounded-xl bg-slate-50 border border-slate-100 p-5">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center">
            <FiActivity />
          </div>

          <div>

            <p className="text-xs text-slate-400">
              Heart Rate
            </p>

            <div className="mt-1 flex items-baseline gap-1">

              <strong className="text-xl font-bold text-slate-900">
                {patient?.latestVitals?.heartRate ?? "--"}
              </strong>

              <span className="text-xs text-slate-400">
                bpm
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* WEIGHT */}

      <div className="rounded-xl bg-slate-50 border border-slate-100 p-5">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <FiUser />
          </div>

          <div>

            <p className="text-xs text-slate-400">
              Weight
            </p>

            <div className="mt-1 flex items-baseline gap-1">

              <strong className="text-xl font-bold text-slate-900">
                {patient?.latestVitals?.weight ?? "--"}
              </strong>

              <span className="text-xs text-slate-400">
                kg
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* BLOOD SUGAR */}

      <div className="rounded-xl bg-slate-50 border border-slate-100 p-5">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <FiActivity />
          </div>

          <div>

            <p className="text-xs text-slate-400">
              Blood Sugar
            </p>

            <div className="mt-1 flex items-baseline gap-1">

              <strong className="text-xl font-bold text-slate-900">
                {patient?.latestVitals?.bloodSugar ?? "--"}
              </strong>

              <span className="text-xs text-slate-400">
                mg/dL
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>


    {patient?.latestVitals?.updatedAt && (
      <p className="text-xs text-slate-400 mt-4">
        Last updated{" "}
        {new Date(
          patient.latestVitals.updatedAt
        ).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })}
      </p>
    )}

  </div>

</div>

        {/* =====================================================
            APPOINTMENT DATE SELECTOR
        ===================================================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6">

          <div className="p-5 sm:p-6">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  Appointment History
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Select an appointment date to view the medical report.
                </p>

              </div>


              {/* Dropdown */}

              <div className="relative w-full lg:w-80">

                <button
                  type="button"
                  onClick={() =>
                    setDropdownOpen(
                      !dropdownOpen
                    )
                  }
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 transition"
                >

                  <div className="flex items-center gap-3">

                    <FiCalendar className="text-sky-500" />

                    <span>

                      {selectedAppointment
                        ? new Date(
                            selectedAppointment.date
                          ).toLocaleDateString(
                            "en-US",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            }
                          )
                        : "Select appointment"}

                    </span>

                  </div>


                  <FiChevronDown
                    className={`transition ${
                      dropdownOpen
                        ? "rotate-180"
                        : ""
                    }`}
                  />

                </button>


                {dropdownOpen && (

                  <div className="absolute z-30 top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">

                    {appointments.map(
                      (appointment) => (

                        <button
                          key={appointment._id}
                          type="button"
                          onClick={() =>
                            selectAppointment(
                              appointment._id
                            )
                          }
                          className={`w-full text-left px-4 py-3 hover:bg-sky-50 transition border-b last:border-b-0 border-slate-100 ${
                            selectedAppointmentId ===
                            appointment._id
                              ? "bg-sky-50"
                              : ""
                          }`}
                        >

                          <div className="flex items-center justify-between gap-3">

                            <div>

                              <p className="text-sm font-semibold text-slate-800">

                                {new Date(
                                  appointment.date
                                ).toLocaleDateString(
                                  "en-US",
                                  {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                  }
                                )}

                              </p>


                              <p className="text-xs text-slate-500 mt-1">

                                {appointment.startTime ||
                                  appointment.slot?.startTime ||
                                  "N/A"}

                                {" - "}

                                {appointment.endTime ||
                                  appointment.slot?.endTime ||
                                  "N/A"}

                              </p>

                            </div>


                            <span
                              className={`text-xs font-medium ${
                                appointment.medicalRecord
                                  ? "text-emerald-600"
                                  : "text-slate-400"
                              }`}
                            >

                              {appointment.medicalRecord
                                ? "Record Available"
                                : "No Record"}

                            </span>

                          </div>

                        </button>

                      )
                    )}

                  </div>

                )}

              </div>

            </div>

          </div>

        </div>


        {/* =====================================================
            SELECTED APPOINTMENT
        ===================================================== */}

        {selectedAppointment && (

          <>

            {/* Appointment Information */}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6">

              <div className="p-5 sm:p-6">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                  <div>

                    <div className="flex flex-wrap items-center gap-3">

                      <h2 className="text-xl font-bold text-slate-900">

                        {new Date(
                          selectedAppointment.date
                        ).toLocaleDateString(
                          "en-US",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }
                        )}

                      </h2>


                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">

                        {selectedAppointment.status}

                      </span>

                    </div>


                    <p className="text-sm text-slate-500 mt-2">

                      {selectedAppointment.day ||
                        selectedAppointment.slot?.day ||
                        "N/A"}

                    </p>

                  </div>


                  <div className="flex flex-wrap gap-4 text-sm">

                    <div className="flex items-center gap-2 text-slate-600">

                      <FiClock className="text-sky-500" />

                      {selectedAppointment.startTime ||
                        selectedAppointment.slot?.startTime ||
                        "N/A"}

                      {" - "}

                      {selectedAppointment.endTime ||
                        selectedAppointment.slot?.endTime ||
                        "N/A"}

                    </div>


                    <div className="flex items-center gap-2 text-slate-600">

                      <FiUserCheck className="text-sky-500" />

                      {selectedAppointment.doctor?.name ||
                        "N/A"}

                    </div>

                  </div>

                </div>


                {/* Department + Reason */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

                  <div className="p-4 rounded-xl bg-slate-50">

                    <p className="text-xs text-slate-400">
                      Department
                    </p>

                    <p className="text-sm font-semibold text-slate-800 mt-1">

                      {selectedAppointment.doctor?.department ||
                        "N/A"}

                    </p>

                  </div>


                  <div className="p-4 rounded-xl bg-slate-50">

                    <p className="text-xs text-slate-400">
                      Reason for Visit
                    </p>

                    <p className="text-sm font-semibold text-slate-800 mt-1">

                      {selectedAppointment.reason ||
                        "N/A"}

                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* =====================================================
                MEDICAL REPORT
            ===================================================== */}

            {!record ? (

              <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-8">

                <div className="flex flex-col items-center justify-center text-center">

                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">

                    <FiAlertCircle size={24} />

                  </div>


                  <h3 className="text-lg font-semibold text-slate-800">
                    No Medical Record
                  </h3>


                  <p className="text-sm text-slate-500 mt-2">
                    No medical record has been created for this appointment.
                  </p>

                </div>

              </div>

            ) : (

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

                {/* Report Header */}

                <div className="p-5 sm:p-6 border-b border-slate-100">

                  <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">

                      <FiFileText size={22} />

                    </div>


                    <div>

                      <h2 className="text-lg font-bold text-slate-900">
                        Medical Report
                      </h2>

                      <p className="text-sm text-slate-500">
                        Medical information recorded during this visit.
                      </p>

                    </div>

                  </div>

                </div>


                <div className="p-5 sm:p-6">

                  {/* =================================================
                      DIAGNOSIS + CLINICAL FINDINGS
                  ================================================= */}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                    <div className="border border-slate-200 rounded-xl p-5">

                      <div className="flex items-center gap-2 mb-3">

                        <FiActivity className="text-sky-500" />

                        <h3 className="font-semibold text-slate-800">
                          Diagnosis
                        </h3>

                      </div>


                      <p className="text-sm text-slate-600 leading-6">

                        {record?.diagnosis ||
                          "No diagnosis recorded."}

                      </p>

                    </div>


                    <div className="border border-slate-200 rounded-xl p-5">

                      <div className="flex items-center gap-2 mb-3">

                        <FiClipboard className="text-sky-500" />

                        <h3 className="font-semibold text-slate-800">
                          Clinical Findings
                        </h3>

                      </div>


                      <p className="text-sm text-slate-600 leading-6">

                        {record?.clinicalFindings ||
                          "No clinical findings recorded."}

                      </p>

                    </div>

                  </div>


                  {/* =================================================
                      BLOOD TEST
                  ================================================= */}

                  <div className="mt-5 border border-slate-200 rounded-xl p-5">

                    <div className="flex items-center gap-2 mb-4">

                      <FiHeart className="text-red-500" />

                      <h3 className="font-semibold text-slate-800">
                        Blood Test
                      </h3>

                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      <div className="bg-slate-50 rounded-xl p-4">

                        <p className="text-xs text-slate-400">
                          Test Name
                        </p>

                        <p className="text-sm font-semibold text-slate-800 mt-1">

                          {record?.bloodTest?.name ||
                            "Not recorded"}

                        </p>

                      </div>


                      <div className="bg-slate-50 rounded-xl p-4">

                        <p className="text-xs text-slate-400">
                          Result
                        </p>

                        <p className="text-sm font-semibold text-slate-800 mt-1">

                          {record?.bloodTest?.result ||
                            "Not recorded"}

                        </p>

                      </div>

                    </div>

                  </div>


                  {/* =================================================
                      PRESCRIPTIONS
                  ================================================= */}

                  <div className="mt-5 border border-slate-200 rounded-xl overflow-hidden">

                    <div className="p-5 border-b border-slate-100">

                      <div className="flex items-center gap-2">

                        <FiClipboard className="text-sky-500" />

                        <h3 className="font-semibold text-slate-800">
                          Prescriptions
                        </h3>

                      </div>

                    </div>


                    <div className="overflow-x-auto">

                      <table className="w-full min-w-[700px]">

                        <thead className="bg-slate-50">

                          <tr>

                            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                              Medicine
                            </th>

                            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                              Dosage
                            </th>

                            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                              Frequency
                            </th>

                            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                              Duration
                            </th>

                            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                              Instructions
                            </th>

                          </tr>

                        </thead>


                        <tbody>

                          {record?.prescriptions?.length > 0 ? (

                            record.prescriptions.map(
                              (medicine, index) => (

                                <tr
                                  key={index}
                                  className="border-t border-slate-100"
                                >

                                  <td className="px-5 py-4 text-sm font-semibold text-slate-800">

                                    {medicine.medicineName ||
                                      "N/A"}

                                  </td>


                                  <td className="px-5 py-4 text-sm text-slate-600">

                                    {medicine.dosage ||
                                      "N/A"}

                                  </td>


                                  <td className="px-5 py-4 text-sm text-slate-600">

                                    {medicine.frequency ||
                                      "N/A"}

                                  </td>


                                  <td className="px-5 py-4 text-sm text-slate-600">

                                    {medicine.duration ||
                                      "N/A"}

                                  </td>


                                  <td className="px-5 py-4 text-sm text-slate-600">

                                    {medicine.instructions ||
                                      "N/A"}

                                  </td>

                                </tr>

                              )
                            )

                          ) : (

                            <tr>

                              <td
                                colSpan="5"
                                className="px-5 py-6 text-center text-sm text-slate-400"
                              >
                                No prescriptions recorded.
                              </td>

                            </tr>

                          )}

                        </tbody>

                      </table>

                    </div>

                  </div>


                  {/* =================================================
                      TREATMENT NOTES + REMARKS
                  ================================================= */}

                  <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5">

                    <div className="border border-slate-200 rounded-xl p-5">

                      <h3 className="font-semibold text-slate-800 mb-3">
                        Treatment Notes
                      </h3>

                      <p className="text-sm text-slate-600 leading-6">

                        {record?.treatmentNotes ||
                          "No treatment notes recorded."}

                      </p>

                    </div>


                    <div className="border border-slate-200 rounded-xl p-5">

                      <h3 className="font-semibold text-slate-800 mb-3">
                        Remarks
                      </h3>

                      <p className="text-sm text-slate-600 leading-6">

                        {record?.remarks ||
                          "No remarks recorded."}

                      </p>

                    </div>

                  </div>


                  {/* =================================================
                      FOLLOW UP
                  ================================================= */}

                  <div className="mt-5 border border-slate-200 rounded-xl p-5">

                    <div className="flex items-center gap-2 mb-3">

                      <FiCalendar className="text-sky-500" />

                      <h3 className="font-semibold text-slate-800">
                        Follow-up
                      </h3>

                    </div>


                    {record?.followUp?.required ? (

                      <div className="flex flex-wrap items-center gap-3">

                        <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">

                          Follow-up Required

                        </span>


                        <span className="text-sm text-slate-600">

                          {record?.followUp?.date
                            ? new Date(
                                record.followUp.date
                              ).toLocaleDateString(
                                "en-US",
                                {
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                }
                              )
                            : "Date not specified"}

                        </span>

                      </div>

                    ) : (

                      <span className="text-sm text-slate-500">
                        No follow-up required.
                      </span>

                    )}

                  </div>


                  {/* =================================================
                      MEDICAL DOCUMENTS
                  ================================================= */}

                  <div className="mt-5 border border-slate-200 rounded-xl p-5">

                    <div className="flex items-center gap-2 mb-4">

                      <FiFileText className="text-sky-500" />

                      <h3 className="font-semibold text-slate-800">
                        Medical Documents
                      </h3>

                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                      {/* Prescription */}

                      {record?.documents?.prescription?.path && (

                        <a
                          href={`http://localhost:5000${record.documents.prescription.path}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between gap-3 p-4 border border-slate-200 rounded-xl hover:border-sky-300 hover:bg-sky-50 transition"
                        >

                          <div className="flex items-center gap-3 min-w-0">

                            <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">

                              <FiFileText />

                            </div>


                            <div className="min-w-0">

                              <p className="text-xs text-slate-400">
                                Prescription
                              </p>

                              <p className="text-sm font-medium text-slate-700 truncate">

                                {record.documents.prescription.originalName ||
                                  "Prescription"}

                              </p>

                            </div>

                          </div>


                          <FiDownload className="text-slate-400 shrink-0" />

                        </a>

                      )}


                      {/* Lab Report */}

                      {record?.documents?.labReport?.path && (

                        <a
                          href={`http://localhost:5000${record.documents.labReport.path}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between gap-3 p-4 border border-slate-200 rounded-xl hover:border-sky-300 hover:bg-sky-50 transition"
                        >

                          <div className="flex items-center gap-3 min-w-0">

                            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">

                              <FiFileText />

                            </div>


                            <div className="min-w-0">

                              <p className="text-xs text-slate-400">
                                Lab Report
                              </p>

                              <p className="text-sm font-medium text-slate-700 truncate">

                                {record.documents.labReport.originalName ||
                                  "Lab Report"}

                              </p>

                            </div>

                          </div>


                          <FiDownload className="text-slate-400 shrink-0" />

                        </a>

                      )}


                      {/* Other Medical Document */}

                      {record?.documents?.otherMedicalDocument?.path && (

                        <a
                          href={`http://localhost:5000${record.documents.otherMedicalDocument.path}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between gap-3 p-4 border border-slate-200 rounded-xl hover:border-sky-300 hover:bg-sky-50 transition"
                        >

                          <div className="flex items-center gap-3 min-w-0">

                            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">

                              <FiFileText />

                            </div>


                            <div className="min-w-0">

                              <p className="text-xs text-slate-400">
                                Other Document
                              </p>

                              <p className="text-sm font-medium text-slate-700 truncate">

                                {record.documents.otherMedicalDocument.originalName ||
                                  "Other Document"}

                              </p>

                            </div>

                          </div>


                          <FiDownload className="text-slate-400 shrink-0" />

                        </a>

                      )}

                    </div>


                    {/* No Documents */}

                    {!record?.documents?.prescription?.path &&
                      !record?.documents?.labReport?.path &&
                      !record?.documents?.otherMedicalDocument?.path && (

                        <div className="flex items-center gap-3 text-sm text-slate-500">

                          <FiAlertCircle />

                          No medical documents uploaded for this appointment.

                        </div>

                      )}

                  </div>

                </div>

              </div>

            )}

          </>

        )}

      </div>
{/* =====================================================
    UPDATE VITALS MODAL
===================================================== */}

{vitalsModalOpen && (

  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

    {/* BACKDROP */}

    <button
      type="button"
      aria-label="Close"
      onClick={() =>
        !vitalsSaving &&
        setVitalsModalOpen(false)
      }
      className="absolute inset-0 bg-slate-900/40"
    />

    {/* MODAL */}

    <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200">

      {/* HEADER */}

      <div className="p-5 border-b border-slate-100 flex items-center justify-between">

        <div>

          <h2 className="text-lg font-bold text-slate-900">
            Update Latest Information
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            {patient?.name || "Patient"}
          </p>

        </div>

        <button
          type="button"
          disabled={vitalsSaving}
          onClick={() =>
            setVitalsModalOpen(false)
          }
          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          ×
        </button>

      </div>


      {/* FORM */}

      <form
        onSubmit={handleSaveVitals}
        className="p-5 sm:p-6"
      >

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* BLOOD PRESSURE */}

          <div>

            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Blood Pressure
            </label>

            <div className="relative">

              <input
                type="text"
                name="bloodPressure"
                value={
                  vitalsForm.bloodPressure
                }
                onChange={
                  handleVitalsChange
                }
                placeholder="120/80"
                className="w-full px-4 py-3 pr-16 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                mmHg
              </span>

            </div>

          </div>


          {/* HEART RATE */}

          <div>

            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Heart Rate
            </label>

            <div className="relative">

              <input
                type="number"
                min="0"
                name="heartRate"
                value={
                  vitalsForm.heartRate
                }
                onChange={
                  handleVitalsChange
                }
                placeholder="72"
                className="w-full px-4 py-3 pr-14 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                bpm
              </span>

            </div>

          </div>


          {/* WEIGHT */}

          <div>

            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Weight
            </label>

            <div className="relative">

              <input
                type="number"
                min="0"
                step="0.1"
                name="weight"
                value={
                  vitalsForm.weight
                }
                onChange={
                  handleVitalsChange
                }
                placeholder="68"
                className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                kg
              </span>

            </div>

          </div>


          {/* BLOOD SUGAR */}

          <div>

            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Blood Sugar
            </label>

            <div className="relative">

              <input
                type="number"
                min="0"
                step="0.1"
                name="bloodSugar"
                value={
                  vitalsForm.bloodSugar
                }
                onChange={
                  handleVitalsChange
                }
                placeholder="96"
                className="w-full px-4 py-3 pr-14 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                mg/dL
              </span>

            </div>

          </div>

        </div>


        {/* ERROR */}

        {vitalsError && (

          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
            {vitalsError}
          </div>

        )}


        {/* ACTIONS */}

        <div className="flex justify-end gap-3 mt-6">

          <button
            type="button"
            disabled={vitalsSaving}
            onClick={() =>
              setVitalsModalOpen(false)
            }
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={vitalsSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 disabled:opacity-60"
          >

            <FiSave />

            {vitalsSaving
              ? "Saving..."
              : "Save Information"}

          </button>

        </div>

      </form>

    </div>

  </div>

)}
    </div>
  );
};

export default MedicalRecord;