import React, {useEffect, useState } from "react";
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
} from "react-icons/fi";
import { getMyPatientProfile,getMyMedicalHistory, } from "../../services/patientProfileService";
const MedicalHistory = () => {
 

  const [patient, setPatient] = useState(null);
  const [loadingPatient, setLoadingPatient] = useState(true);
  const [patientError, setPatientError] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [appointmentError, setAppointmentError] = useState("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState("");

  useEffect(() => {
    const fetchPatientProfile = async () => {
      try {
        setLoadingPatient(true);
        setPatientError("");

        const response = await getMyPatientProfile();

        console.log("Patient profile:", response);

        const user = response?.user || {};
        const profile = response?.profile || {};

        setPatient({
          name: user.name || "N/A",
          patientId: user.patientId || user._id || "N/A",
          email: user.email || "N/A",
          phone: user.phone || "N/A",

          dateOfBirth: profile.dateOfBirth
            ? new Date(profile.dateOfBirth).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
            : "N/A",

          gender: profile.gender || "N/A",
          bloodGroup: profile.bloodGroup || "N/A",

          address: [
            profile.address?.street,
            profile.address?.city,
            profile.address?.state,
            profile.address?.zipCode,
            profile.address?.country,
          ]
            .filter(Boolean)
            .join(", ") || "N/A",
        });
      } catch (error) {
        console.error("Failed to fetch patient profile:", error);

        setPatientError(
          error.response?.data?.message ||
            "Failed to load patient information."
        );
      } finally {
        setLoadingPatient(false);
      }
    };

    fetchPatientProfile();
  }, []);
useEffect(() => {

  const fetchMedicalHistory = async () => {

    try {

      setLoadingAppointments(true);

      setAppointmentError("");

      const response =
        await getMyMedicalHistory();

      console.log(
        "Medical history:",
        response
      );


      const history =
        Array.isArray(response)
          ? response
          : response?.appointments || [];


      /*
       * Backend already sorts newest first.
       * Keep the extra sort here as a safety measure.
       */

      const sortedHistory =
        [...history].sort(
          (a, b) =>
            new Date(b.date) -
            new Date(a.date)
        );


      setAppointments(
        sortedHistory
      );


      /*
       * Automatically select
       * most recent appointment.
       */

      if (sortedHistory.length > 0) {

        setSelectedAppointmentId(
          sortedHistory[0]._id
        );

      }

    } catch (error) {

      console.error(
        "Failed to fetch medical history:",
        error
      );

      setAppointmentError(
        error.response?.data?.message ||
          "Failed to load medical history."
      );

    } finally {

      setLoadingAppointments(false);

    }

  };


  fetchMedicalHistory();

}, []);

  // =====================================================
  // SAMPLE APPOINTMENT / MEDICAL HISTORY
  // Later this will come from Appointment + MedicalRecord
  // =====================================================

  

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedAppointment =
  appointments.find(
    (appointment) => appointment._id === selectedAppointmentId
  ) || appointments[0];

  // =====================================================
  // HELPERS
  // =====================================================

  const selectAppointment = (id) => {
    setSelectedAppointmentId(id);
    setDropdownOpen(false);
  };

  const record = selectedAppointment?.medicalRecord;

  if (loadingPatient || loadingAppointments) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin" />
            </div>

            <p className="text-center text-sm text-slate-500 mt-4">
              Loading patient information...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (patientError) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-6">
            <div className="flex items-center gap-3 text-red-600">
              <FiAlertCircle size={22} />

              <p className="text-sm font-semibold">
                {patientError}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (appointmentError) {
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-6">
          <div className="flex items-center gap-3 text-red-600">
            <FiAlertCircle size={22} />

            <p className="text-sm font-semibold">
              {appointmentError}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Medical History
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            View patient information, appointments and medical records.
          </p>
        </div>

        {/* =====================================================
            PATIENT INFORMATION
        ===================================================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6">
          <div className="p-5 sm:p-6">

            <div className="flex flex-col lg:flex-row lg:items-center gap-5">

              {/* Patient Avatar */}

              <div className="w-20 h-20 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                <FiUser size={38} />
              </div>

              {/* Patient Name */}

              <div className="flex-1">

                <div className="flex flex-wrap items-center gap-3">

                  <h2 className="text-xl font-bold text-slate-900">
                    {patient.name}
                  </h2>

                  <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold">
                    {patient.patientId}
                  </span>

                </div>

                <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 text-sm text-slate-500">

                  <span className="flex items-center gap-2">
                    <FiMail />
                    {patient.email}
                  </span>

                  <span className="flex items-center gap-2">
                    <FiPhone />
                    {patient.phone}
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
                    {patient.dateOfBirth}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Gender
                  </p>

                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {patient.gender}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Blood Group
                  </p>

                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {patient.bloodGroup}
                  </p>
                </div>

              </div>

            </div>

            <div className="mt-5 pt-5 border-t border-slate-100">

              <div className="flex items-start gap-2 text-sm text-slate-600">
                <FiMapPin className="text-sky-500 mt-0.5 shrink-0" />

                <span>
                  {patient.address}
                </span>
              </div>

            </div>

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
                  Select an appointment date to view its medical report.
                </p>

              </div>

              {/* Dropdown */}

              <div className="relative w-full lg:w-80">

                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 transition"
                >

                  <div className="flex items-center gap-3">

                    <FiCalendar className="text-sky-500" />

                    <span>
                        {selectedAppointment
                          ? new Date(selectedAppointment.date).toLocaleDateString(
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
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />

                </button>

                {dropdownOpen && (
                  <div className="absolute z-30 top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">

                    {appointments.map((appointment) => (

                      <button
                        key={appointment._id}
                        type="button"
                        onClick={() => selectAppointment(appointment._id)}
                        className={`w-full text-left px-4 py-3 hover:bg-sky-50 transition border-b last:border-b-0 border-slate-100 ${
                          selectedAppointmentId === appointment._id
                            ? "bg-sky-50"
                            : ""
                        }`}
                      >

                        <div className="flex items-center justify-between gap-3">

                          <div>

                            <p className="text-sm font-semibold text-slate-800">
                              {new Date(appointment.date).toLocaleDateString("en-US", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>

                            <p className="text-xs text-slate-500 mt-1">
                              {appointment.doctor?.name || "N/A"} •{" "}
                              {appointment.doctor?.department || "N/A"}
                            </p>

                          </div>

                          <span className="text-xs font-medium text-emerald-600">
                            {appointment.status}
                          </span>

                        </div>

                      </button>

                    ))}

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

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6">

              <div className="p-5 sm:p-6">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                  <div>

                    <div className="flex flex-wrap items-center gap-3">

                      <h2 className="text-xl font-bold text-slate-900">
                          {new Date(
                            selectedAppointment.date
                          ).toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </h2>

                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                        {selectedAppointment.status}
                      </span>

                    </div>

                    <p className="text-sm text-slate-500 mt-2">
                      {selectedAppointment.day}
                    </p>

                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">

                    <div className="flex items-center gap-2 text-slate-600">
                      <FiClock className="text-sky-500" />
                      {selectedAppointment.startTime} -{" "}
                      {selectedAppointment.endTime}
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                      <FiUserCheck className="text-sky-500" />
                      {selectedAppointment.doctor?.name || "N/A"}
                    </div>

                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

                  <div className="p-4 rounded-xl bg-slate-50">
                    <p className="text-xs text-slate-400">
                      Department
                    </p>

                    <p className="text-sm font-semibold text-slate-800 mt-1">
                        {selectedAppointment.doctor?.department || "N/A"}
                      </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50">
                    <p className="text-xs text-slate-400">
                      Reason for Visit
                    </p>

                    <p className="text-sm font-semibold text-slate-800 mt-1">
                      {selectedAppointment.reason}
                    </p>
                  </div>

                </div>

              </div>

            </div>

            {/* =====================================================
                MEDICAL REPORT
            ===================================================== */}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

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

                {/* Diagnosis + Clinical Findings */}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                  <div className="border border-slate-200 rounded-xl p-5">

                    <div className="flex items-center gap-2 mb-3">
                      <FiActivity className="text-sky-500" />

                      <h3 className="font-semibold text-slate-800">
                        Diagnosis
                      </h3>
                    </div>

                    <p className="text-sm text-slate-600 leading-6">
                      {record?.diagnosis || "No diagnosis recorded."}
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

                {/* Blood Test */}

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
                        {record?.bloodTest?.name || "Not recorded"}
                      </p>

                    </div>

                    <div className="bg-slate-50 rounded-xl p-4">

                      <p className="text-xs text-slate-400">
                        Result
                      </p>

                      <p className="text-sm font-semibold text-slate-800 mt-1">
                        {record?.bloodTest?.result || "Not recorded"}
                      </p>

                    </div>

                  </div>

                </div>

                {/* Prescriptions */}

                <div className="mt-5 border border-slate-200 rounded-xl overflow-hidden">

                  <div className="p-5 border-b border-slate-100">

                    <div className="flex items-center gap-2">

                      <FiClipboard className="text-sky-500" />

                      

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

                          record.prescriptions.map((medicine, index) => (

                            <tr
                              key={index}
                              className="border-t border-slate-100"
                            >

                              <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                                {medicine.medicineName}
                              </td>

                              <td className="px-5 py-4 text-sm text-slate-600">
                                {medicine.dosage}
                              </td>

                              <td className="px-5 py-4 text-sm text-slate-600">
                                {medicine.frequency}
                              </td>

                              <td className="px-5 py-4 text-sm text-slate-600">
                                {medicine.duration}
                              </td>

                              <td className="px-5 py-4 text-sm text-slate-600">
                                {medicine.instructions}
                              </td>

                            </tr>

                          ))

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

                {/* Treatment Notes */}

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
                      {record?.remarks || "No remarks recorded."}
                    </p>

                  </div>

                </div>

                {/* Follow Up */}

                <div className="mt-5 border border-slate-200 rounded-xl p-5">

                  <div className="flex items-center gap-2 mb-3">

                    <FiCalendar className="text-sky-500" />

                    <h3 className="font-semibold text-slate-800">
                      Follow-up
                    </h3>

                  </div>

                  {record?.followUp?.required ? (

                    <div className="flex items-center gap-3">

                      <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">
                        Follow-up Required
                      </span>

                      <span className="text-sm text-slate-600">
                        {record.followUp.date}
                      </span>

                    </div>

                  ) : (

                    <span className="text-sm text-slate-500">
                      No follow-up required.
                    </span>

                  )}

                </div>

                {/* Documents */}

                <div className="mt-5 border border-slate-200 rounded-xl p-5">

                  <div className="flex items-center gap-2 mb-4">

                    <FiFileText className="text-sky-500" />

                    <h3 className="font-semibold text-slate-800">
                      Medical Documents
                    </h3>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* Prescription */}

                    {record?.documents?.prescription && (
                      <a
                        href={`http://localhost:5000${record.documents.prescription.path}`}
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
                              {record.documents.prescription.originalName}
                            </p>

                          </div>

                        </div>

                        <FiDownload className="text-slate-400 shrink-0" />

                      </a>
                    )}

                    {/* Lab Report */}

                    {record?.documents?.labReport && (
                      <a
                        href={`http://localhost:5000${record.documents.labReport.path}`}
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
                              {record.documents.labReport.originalName}
                            </p>

                          </div>

                        </div>

                        <FiDownload className="text-slate-400 shrink-0" />

                      </a>
                    )}

                    {/* Other Medical Document */}

                    {record?.documents?.otherMedicalDocument && (
                      <a
                        href={`http://localhost:5000${record.documents.otherMedicalDocument.path}`}
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
                              {record.documents.otherMedicalDocument.originalName}
                            </p>

                          </div>

                        </div>

                        <FiDownload className="text-slate-400 shrink-0" />

                      </a>
                    )}

                  </div>

                  {!record?.documents?.prescription &&
                    !record?.documents?.labReport &&
                    !record?.documents?.otherMedicalDocument && (
                      <div className="flex items-center gap-3 text-sm text-slate-500">
                        <FiAlertCircle />
                        No medical documents uploaded for this appointment.
                      </div>
                    )}

                </div>

              </div>

            </div>

          </>
        )}

      </div>
    </div>
  );
};

export default MedicalHistory;