import { useEffect, useState } from "react";
import {
  getMyTodayAppointments,
  completeAppointment as completeAppointmentAPI,
} from "../../services/doctorService";

import {
  FiX,
  FiUser,
  FiPhone,
  FiMail,
  FiCalendar,
  FiClock,
  FiFileText,
  FiDollarSign,
  FiUpload,
  FiPlus,
  FiTrash2,
  FiCheckCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
const TodayAppointments = () => {

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // SELECTED APPOINTMENT FOR VIEW POPUP
  // =====================================================

  const [selectedAppointment, setSelectedAppointment] =
    useState(null);
    // =====================================================
// COMPLETE APPOINTMENT POPUP
// =====================================================

const [completeAppointment, setCompleteAppointment] =
  useState(null);

const [medicalForm, setMedicalForm] = useState({
  diagnosis: "",
  clinicalFindings: "",
  bloodTestName: "",
  bloodTestResult: "",
  treatmentNotes: "",
  remarks: "",
  followUpRequired: false,
  followUpDate: "",
});

const [prescriptions, setPrescriptions] = useState([
  {
    medicineName: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
  },
]);

const [prescriptionFile, setPrescriptionFile] =
  useState(null);

const [labReportFile, setLabReportFile] =
  useState(null);

const [otherMedicalFile, setOtherMedicalFile] =
  useState(null);

const [notification, setNotification] = useState({
  show: false,
  type: "",
  message: "",
});
const navigate = useNavigate();

  // =====================================================
  // LOAD TODAY'S APPOINTMENTS
  // =====================================================

  useEffect(() => {

    const loadAppointments = async () => {

      try {

        setLoading(true);

        const response =
          await getMyTodayAppointments();

        console.log(
          "Doctor today's appointments:",
          response
        );

        setAppointments(
          response.appointments || []
        );

      } catch (error) {

        console.error(
          "Failed to load today's appointments:",
          error
        );

      } finally {

        setLoading(false);

      }

    };

    loadAppointments();

  }, []);


  // =====================================================
  // CALCULATE PATIENT AGE
  // =====================================================

  const calculateAge = (dateOfBirth) => {

    if (!dateOfBirth) {
      return "-";
    }

    const birthDate = new Date(dateOfBirth);
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
        today.getDate() < birthDate.getDate()
      )
    ) {
      age--;
    }

    return age;
  };


  // =====================================================
  // CLOSE VIEW POPUP
  // =====================================================

  const closeViewPopup = () => {
    setSelectedAppointment(null);
  };
  // =====================================================
// OPEN COMPLETE APPOINTMENT POPUP
// =====================================================

const openCompletePopup = (appointment) => {

  setCompleteAppointment(appointment);

  setMedicalForm({
    diagnosis: "",
    clinicalFindings: "",
    bloodTestName: "",
    bloodTestResult: "",
    treatmentNotes: "",
    remarks: "",
    followUpRequired: false,
    followUpDate: "",
  });

  setPrescriptions([
    {
      medicineName: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
    },
  ]);

  setPrescriptionFile(null);
  setLabReportFile(null);
  setOtherMedicalFile(null);
};


// =====================================================
// CLOSE COMPLETE POPUP
// =====================================================

const closeCompletePopup = () => {

  setCompleteAppointment(null);

};
// =====================================================
// SHOW SUCCESS / ERROR POPUP
// =====================================================

const showNotification = (type, message) => {
  setNotification({
    show: true,
    type,
    message,
  });
};

const closeNotification = () => {
  setNotification({
    show: false,
    type: "",
    message: "",
  });
};


// =====================================================
// MEDICAL FORM CHANGE
// =====================================================

const handleMedicalFormChange = (e) => {

  const { name, value, type, checked } = e.target;

  setMedicalForm((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));

};


// =====================================================
// PRESCRIPTION CHANGE
// =====================================================

const handlePrescriptionChange = (
  index,
  field,
  value
) => {

  setPrescriptions((prev) => {

    const updated = [...prev];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    return updated;

  });

};


// =====================================================
// ADD PRESCRIPTION
// =====================================================

const addPrescription = () => {

  setPrescriptions((prev) => [
    ...prev,
    {
      medicineName: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
    },
  ]);

};


// =====================================================
// REMOVE PRESCRIPTION
// =====================================================

const removePrescription = (index) => {

  setPrescriptions((prev) =>
    prev.filter((_, prescriptionIndex) =>
      prescriptionIndex !== index
    )
  );

};

const handleMedicalRecord = (patientId) => {
  navigate(`/doctor/medical-record/${patientId}`);
};
// =====================================================
// TEMPORARY COMPLETE HANDLER
// BACKEND WILL BE CONNECTED LATER
// =====================================================

const handleCompleteAppointment = async (e) => {

  e.preventDefault();


  try {

    if (!completeAppointment?._id) {

      return;

    }


    const medicalData = {

  diagnosis:
    medicalForm.diagnosis,

  clinicalFindings:
    medicalForm.clinicalFindings,

  bloodTestName:
    medicalForm.bloodTestName,

  bloodTestResult:
    medicalForm.bloodTestResult,

  prescriptions,

  treatmentNotes:
    medicalForm.treatmentNotes,

  remarks:
    medicalForm.remarks,

  followUpRequired:
    medicalForm.followUpRequired,

  followUpDate:
    medicalForm.followUpDate || null,


  /* =================================================
     FILES
  ================================================= */

  prescriptionFile:
    prescriptionFile,

  labReportFile:
    labReportFile,

  otherMedicalFile:
    otherMedicalFile,

};


    console.log(
      "Submitting medical record:",
      medicalData
    );


    const response =
      await completeAppointmentAPI(
        completeAppointment._id,
        medicalData
      );


    console.log(
      "Complete appointment response:",
      response
    );


    /* =========================================
       UPDATE TABLE
    ========================================= */

    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment._id ===
        completeAppointment._id
          ? {
              ...appointment,
              status: "Completed",
            }
          : appointment
      )
    );


    showNotification(
      "success",
      "Appointment completed successfully."
    );

    closeCompletePopup();


    closeCompletePopup();


  } catch (error) {

    console.error(
      "Failed to complete appointment:",
      error
    );


    showNotification(
      "error",
      error.response?.data?.message ||
        "Failed to complete appointment."
    );

  }

};


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="table-card">

        <h3>Today's Appointments</h3>

        <p>
          Loading appointments...
        </p>

      </div>
    );
  }


  return (
    <>
      {/* =====================================================
          APPOINTMENTS TABLE
      ===================================================== */}

      <div className="table-card">

        <h3>
          Today's Appointments
        </h3>


        <table>

          <thead>

            <tr>

              <th>Time</th>

              <th>Patient</th>

              <th>Age</th>

              <th>Reason</th>

              <th>Status</th>

              <th>Action</th>

            </tr>

          </thead>


          <tbody>

            {appointments.length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                  }}
                >
                  No appointments for today.
                </td>

              </tr>

            ) : (

              appointments.map((appointment) => (

                <tr
                  key={appointment._id}
                >

                  {/* TIME */}

                  <td>

                    {appointment.startTime}

                    {" - "}

                    {appointment.endTime}

                  </td>


                  {/* PATIENT */}

                  <td>

                    {appointment.patient?.name || "-"}

                  </td>


                  {/* AGE */}

                  <td>

                    {calculateAge(
                      appointment.patient?.dateOfBirth
                    )}

                  </td>


                  {/* REASON */}

                  <td>

                    {appointment.reason || "-"}

                  </td>


                  {/* STATUS */}

                  <td>

                    <span
                      className={`
                        appointment-status
                        status-${appointment.status
                          ?.toLowerCase()
                          .replace(/\s+/g, "-")}
                      `}
                    >
                      {appointment.status}
                    </span>

                  </td>


                  {/* ACTION */}

                  <td>

                    {/* VIEW */}

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedAppointment(
                          appointment
                        )
                      }
                    >
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleMedicalRecord(appointment.patient?._id)
                      }
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 transition"
                    >
                      <FiFileText size={16} />
                      Medical Record
                    </button>


                    {/* COMPLETE */}

                    {appointment.status === "Checked In" && (

                      <button
                        type="button"
                        onClick={() =>
                          openCompletePopup(appointment)
                        }
                      >
                        Complete
                      </button>

                    )}

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>


      {/* =====================================================
          APPOINTMENT DETAILS POPUP
      ===================================================== */}

      {selectedAppointment && (

        <div
          className="
            fixed
            inset-0
            z-50
            bg-black/40
            flex
            items-center
            justify-center
            p-4
          "
          onClick={closeViewPopup}
        >

          <div
            className="
              bg-white
              w-full
              max-w-2xl
              rounded-2xl
              shadow-2xl
              overflow-hidden
              max-h-[90vh]
              overflow-y-auto
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* =================================================
                POPUP HEADER
            ================================================= */}

            <div
              className="
                flex
                items-center
                justify-between
                px-6
                py-5
                border-b
                border-slate-200
              "
            >

              <div>

                <h2
                  className="
                    text-xl
                    font-bold
                    text-slate-900
                  "
                >
                  Appointment Details
                </h2>

                <p
                  className="
                    text-sm
                    text-slate-500
                    mt-1
                  "
                >
                  View patient and appointment information
                </p>

              </div>


              <button
                type="button"
                onClick={closeViewPopup}
                className="
                  w-9
                  h-9
                  rounded-full
                  bg-slate-100
                  hover:bg-slate-200
                  text-slate-600
                  flex
                  items-center
                  justify-center
                  cursor-pointer
                  transition
                "
              >

                <FiX size={20} />

              </button>

            </div>


            {/* =================================================
                PATIENT HEADER
            ================================================= */}

            <div
              className="
                px-6
                py-5
                bg-sky-50
                border-b
                border-sky-100
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-4
                "
              >

                {/* PATIENT AVATAR */}

                <div
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-sky-600
                    text-white
                    flex
                    items-center
                    justify-center
                    text-xl
                    font-bold
                    shrink-0
                  "
                >

                  {selectedAppointment.patient?.name
                    ?.charAt(0)
                    ?.toUpperCase() || "P"}

                </div>


                <div>

                  <h3
                    className="
                      text-lg
                      font-bold
                      text-slate-900
                    "
                  >
                    {selectedAppointment.patient?.name ||
                      "Unknown Patient"}
                  </h3>

                  <p
                    className="
                      text-sm
                      text-slate-500
                      mt-1
                    "
                  >
                    Patient
                  </p>

                </div>

              </div>

            </div>


            {/* =================================================
                PATIENT DETAILS
            ================================================= */}

            <div className="px-6 py-5">

              <h3
                className="
                  text-sm
                  font-bold
                  text-slate-900
                  mb-4
                "
              >
                Patient Information
              </h3>


              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  gap-4
                "
              >

                {/* NAME */}

                <div
                  className="
                    flex
                    items-start
                    gap-3
                    p-4
                    rounded-xl
                    bg-slate-50
                  "
                >

                  <FiUser
                    className="
                      text-sky-600
                      mt-0.5
                    "
                  />

                  <div>

                    <p
                      className="
                        text-xs
                        text-slate-400
                      "
                    >
                      Patient Name
                    </p>

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-slate-800
                        mt-1
                      "
                    >
                      {selectedAppointment.patient?.name ||
                        "-"}
                    </p>

                  </div>

                </div>


                {/* AGE */}

                <div
                  className="
                    flex
                    items-start
                    gap-3
                    p-4
                    rounded-xl
                    bg-slate-50
                  "
                >

                  <FiUser
                    className="
                      text-sky-600
                      mt-0.5
                    "
                  />

                  <div>

                    <p
                      className="
                        text-xs
                        text-slate-400
                      "
                    >
                      Age
                    </p>

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-slate-800
                        mt-1
                      "
                    >
                      {calculateAge(
                        selectedAppointment.patient
                          ?.dateOfBirth
                      )} years
                    </p>

                  </div>

                </div>


                {/* EMAIL */}

                <div
                  className="
                    flex
                    items-start
                    gap-3
                    p-4
                    rounded-xl
                    bg-slate-50
                  "
                >

                  <FiMail
                    className="
                      text-sky-600
                      mt-0.5
                    "
                  />

                  <div>

                    <p
                      className="
                        text-xs
                        text-slate-400
                      "
                    >
                      Email
                    </p>

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-slate-800
                        mt-1
                        break-all
                      "
                    >
                      {selectedAppointment.patient?.email ||
                        "-"}
                    </p>

                  </div>

                </div>


                {/* PHONE */}

                <div
                  className="
                    flex
                    items-start
                    gap-3
                    p-4
                    rounded-xl
                    bg-slate-50
                  "
                >

                  <FiPhone
                    className="
                      text-sky-600
                      mt-0.5
                    "
                  />

                  <div>

                    <p
                      className="
                        text-xs
                        text-slate-400
                      "
                    >
                      Phone
                    </p>

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-slate-800
                        mt-1
                      "
                    >
                      {selectedAppointment.patient?.phone ||
                        "-"}
                    </p>

                  </div>

                </div>

              </div>


              {/* =================================================
                  APPOINTMENT INFORMATION
              ================================================= */}

              <h3
                className="
                  text-sm
                  font-bold
                  text-slate-900
                  mt-7
                  mb-4
                "
              >
                Appointment Information
              </h3>


              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  gap-4
                "
              >

                {/* DATE */}

                <div
                  className="
                    flex
                    items-start
                    gap-3
                    p-4
                    rounded-xl
                    bg-slate-50
                  "
                >

                  <FiCalendar
                    className="
                      text-sky-600
                      mt-0.5
                    "
                  />

                  <div>

                    <p
                      className="
                        text-xs
                        text-slate-400
                      "
                    >
                      Date
                    </p>

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-slate-800
                        mt-1
                      "
                    >
                      {new Date(
                        selectedAppointment.date
                      ).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>

                  </div>

                </div>


                {/* TIME */}

                <div
                  className="
                    flex
                    items-start
                    gap-3
                    p-4
                    rounded-xl
                    bg-slate-50
                  "
                >

                  <FiClock
                    className="
                      text-sky-600
                      mt-0.5
                    "
                  />

                  <div>

                    <p
                      className="
                        text-xs
                        text-slate-400
                      "
                    >
                      Time
                    </p>

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-slate-800
                        mt-1
                      "
                    >
                      {selectedAppointment.startTime}
                      {" - "}
                      {selectedAppointment.endTime}
                    </p>

                  </div>

                </div>


                {/* FEE */}

                <div
                  className="
                    flex
                    items-start
                    gap-3
                    p-4
                    rounded-xl
                    bg-slate-50
                  "
                >

                  <FiDollarSign
                    className="
                      text-emerald-600
                      mt-0.5
                    "
                  />

                  <div>

                    <p
                      className="
                        text-xs
                        text-slate-400
                      "
                    >
                      Consultation Fee
                    </p>

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-slate-800
                        mt-1
                      "
                    >
                      ₹{selectedAppointment.fee ?? 0}
                    </p>

                  </div>

                </div>


                {/* STATUS */}

                <div
                  className="
                    flex
                    items-start
                    gap-3
                    p-4
                    rounded-xl
                    bg-slate-50
                  "
                >

                  <FiClock
                    className="
                      text-sky-600
                      mt-0.5
                    "
                  />

                  <div>

                    <p
                      className="
                        text-xs
                        text-slate-400
                      "
                    >
                      Status
                    </p>

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-slate-800
                        mt-1
                      "
                    >
                      {selectedAppointment.status || "-"}
                    </p>

                  </div>

                </div>

              </div>
              {/* LAST VISIT */}

                <div
                  className="
                    flex
                    items-start
                    gap-3
                    p-4
                    rounded-xl
                    bg-slate-50
                  "
                >

                  <FiCalendar
                    className="
                      text-sky-600
                      mt-0.5
                    "
                  />

                  <div>

                    <p
                      className="
                        text-xs
                        text-slate-400
                      "
                    >
                      Last Visit
                    </p>

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-slate-800
                        mt-1
                      "
                    >

                      {selectedAppointment.patient?.lastVisit
                        ? new Date(
                            selectedAppointment.patient.lastVisit
                          ).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : "No previous visit"}

                    </p>

                  </div>

                </div>


              {/* =================================================
                  REASON
              ================================================= */}

              <div className="mt-5">

                <div
                  className="
                    flex
                    items-start
                    gap-3
                    p-4
                    rounded-xl
                    bg-slate-50
                  "
                >

                  <FiFileText
                    className="
                      text-sky-600
                      mt-0.5
                      shrink-0
                    "
                  />

                  <div>

                    <p
                      className="
                        text-xs
                        text-slate-400
                      "
                    >
                      Reason for Appointment
                    </p>

                    <p
                      className="
                        text-sm
                        text-slate-800
                        mt-1
                        leading-6
                      "
                    >
                      {selectedAppointment.reason ||
                        "-"}
                    </p>

                  </div>

                </div>

              </div>


              {/* =================================================
                  NOTES
              ================================================= */}

              <div className="mt-4">

                <div
                  className="
                    p-4
                    rounded-xl
                    bg-slate-50
                  "
                >

                  <p
                    className="
                      text-xs
                      text-slate-400
                    "
                  >
                    Additional Notes
                  </p>

                  <p
                    className="
                      text-sm
                      text-slate-800
                      mt-1
                      leading-6
                    "
                  >
                    {selectedAppointment.notes ||
                      "No additional notes."}
                  </p>

                </div>

              </div>

            </div>


            {/* =================================================
                FOOTER
            ================================================= */}

            <div
              className="
                px-6
                py-4
                border-t
                border-slate-200
                flex
                justify-end
              "
            >

              <button
                type="button"
                onClick={closeViewPopup}
                className="
                  px-5
                  py-2.5
                  bg-sky-600
                  hover:bg-sky-700
                  text-white
                  rounded-xl
                  text-sm
                  font-semibold
                  cursor-pointer
                  transition
                "
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

      {/* =====================================================
    COMPLETE APPOINTMENT / MEDICAL RECORD POPUP
===================================================== */}

{completeAppointment && (

  <div
    className="
      fixed
      inset-0
      z-[60]
      bg-black/50
      flex
      items-center
      justify-center
      p-4
    "
  >

    <div
      className="
        bg-white
        w-full
        max-w-4xl
        rounded-2xl
        shadow-2xl
        overflow-hidden
        max-h-[92vh]
        overflow-y-auto
      "
      onClick={(e) => e.stopPropagation()}
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          flex
          items-center
          justify-between
          px-6
          py-5
          border-b
          border-slate-200
          sticky
          top-0
          bg-white
          z-10
        "
      >

        <div>

          <div className="flex items-center gap-3">

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-emerald-100
                text-emerald-600
                flex
                items-center
                justify-center
              "
            >
              <FiCheckCircle size={21} />
            </div>

            <div>

              <h2
                className="
                  text-xl
                  font-bold
                  text-slate-900
                "
              >
                Complete Appointment
              </h2>

              <p
                className="
                  text-sm
                  text-slate-500
                  mt-1
                "
              >
                Complete the patient's medical record
              </p>

            </div>

          </div>

        </div>


        <button
          type="button"
          onClick={closeCompletePopup}
          className="
            w-9
            h-9
            rounded-full
            bg-slate-100
            hover:bg-slate-200
            text-slate-600
            flex
            items-center
            justify-center
            cursor-pointer
          "
        >

          <FiX size={20} />

        </button>

      </div>


      <form
        onSubmit={handleCompleteAppointment}
      >

        <div className="px-6 py-6 space-y-7">


          {/* =================================================
              PATIENT SUMMARY
          ================================================= */}

          <div
            className="
              p-4
              rounded-xl
              bg-sky-50
              border
              border-sky-100
            "
          >

            <div
              className="
                flex
                flex-wrap
                items-center
                justify-between
                gap-3
              "
            >

              <div>

                <p
                  className="
                    text-xs
                    text-slate-400
                  "
                >
                  Patient
                </p>

                <p
                  className="
                    text-base
                    font-bold
                    text-slate-900
                    mt-1
                  "
                >
                  {completeAppointment.patient?.name ||
                    "Unknown Patient"}
                </p>

              </div>


              <div>

                <p
                  className="
                    text-xs
                    text-slate-400
                  "
                >
                  Appointment
                </p>

                <p
                  className="
                    text-sm
                    font-semibold
                    text-slate-800
                    mt-1
                  "
                >
                  {completeAppointment.startTime}
                  {" - "}
                  {completeAppointment.endTime}
                </p>

              </div>


              <div>

                <p
                  className="
                    text-xs
                    text-slate-400
                  "
                >
                  Reason
                </p>

                <p
                  className="
                    text-sm
                    font-semibold
                    text-slate-800
                    mt-1
                  "
                >
                  {completeAppointment.reason || "-"}
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              CLINICAL INFORMATION
          ================================================= */}

          <div>

            <h3
              className="
                text-sm
                font-bold
                text-slate-900
                mb-4
              "
            >
              Clinical Information
            </h3>


            <div className="space-y-4">


              {/* DIAGNOSIS */}

              <div>

                <label
                  className="
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                    mb-2
                  "
                >
                  Diagnosis
                </label>

                <input
                  type="text"
                  name="diagnosis"
                  value={medicalForm.diagnosis}
                  onChange={handleMedicalFormChange}
                  placeholder="Enter diagnosis"
                  className="
                    w-full
                    px-4
                    py-3
                    border
                    border-slate-200
                    rounded-xl
                    outline-none
                    focus:border-sky-500
                    focus:ring-2
                    focus:ring-sky-100
                  "
                />

              </div>


              {/* CLINICAL FINDINGS */}

              <div>

                <label
                  className="
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                    mb-2
                  "
                >
                  Clinical Findings
                </label>

                <textarea
                  name="clinicalFindings"
                  value={medicalForm.clinicalFindings}
                  onChange={handleMedicalFormChange}
                  rows="4"
                  placeholder="Enter examination findings, symptoms, observations..."
                  className="
                    w-full
                    px-4
                    py-3
                    border
                    border-slate-200
                    rounded-xl
                    outline-none
                    resize-none
                    focus:border-sky-500
                    focus:ring-2
                    focus:ring-sky-100
                  "
                />

              </div>

            </div>

          </div>


          {/* =================================================
              BLOOD / LAB TEST
          ================================================= */}

          <div>

            <h3
              className="
                text-sm
                font-bold
                text-slate-900
                mb-4
              "
            >
              Blood Test / Laboratory Information
            </h3>


            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-4
              "
            >

              <div>

                <label
                  className="
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                    mb-2
                  "
                >
                  Test Name
                </label>

                <input
                  type="text"
                  name="bloodTestName"
                  value={medicalForm.bloodTestName}
                  onChange={handleMedicalFormChange}
                  placeholder="e.g. CBC, Blood Sugar, Lipid Profile"
                  className="
                    w-full
                    px-4
                    py-3
                    border
                    border-slate-200
                    rounded-xl
                    outline-none
                    focus:border-sky-500
                    focus:ring-2
                    focus:ring-sky-100
                  "
                />

              </div>


              <div>

                <label
                  className="
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                    mb-2
                  "
                >
                  Test Result
                </label>

                <input
                  type="text"
                  name="bloodTestResult"
                  value={medicalForm.bloodTestResult}
                  onChange={handleMedicalFormChange}
                  placeholder="Enter result / summary"
                  className="
                    w-full
                    px-4
                    py-3
                    border
                    border-slate-200
                    rounded-xl
                    outline-none
                    focus:border-sky-500
                    focus:ring-2
                    focus:ring-sky-100
                  "
                />

              </div>

            </div>


            {/* LAB REPORT UPLOAD */}

            <div className="mt-4">

              <label
                className="
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                  mb-2
                "
              >
                Upload Lab Report
              </label>

              <label
                className="
                  flex
                  items-center
                  gap-3
                  p-4
                  border-2
                  border-dashed
                  border-slate-200
                  rounded-xl
                  cursor-pointer
                  hover:border-sky-400
                  hover:bg-sky-50
                  transition
                "
              >

                <FiUpload
                  className="text-sky-600"
                  size={20}
                />

                <div>

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-slate-700
                    "
                  >
                    {labReportFile
                      ? labReportFile.name
                      : "Choose laboratory report"}
                  </p>

                  <p
                    className="
                      text-xs
                      text-slate-400
                      mt-1
                    "
                  >
                    PDF, JPG, PNG
                  </p>

                </div>

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) =>
                    setLabReportFile(
                      e.target.files?.[0] || null
                    )
                  }
                />

              </label>

            </div>

          </div>


          {/* =================================================
              PRESCRIPTION
          ================================================= */}

          <div>

            <div
              className="
                flex
                items-center
                justify-between
                mb-4
              "
            >

              <h3
                className="
                  text-sm
                  font-bold
                  text-slate-900
                "
              >
                Prescription
              </h3>


              <button
                type="button"
                onClick={addPrescription}
                className="
                  flex
                  items-center
                  gap-2
                  px-3
                  py-2
                  bg-sky-50
                  text-sky-600
                  rounded-lg
                  text-sm
                  font-semibold
                  hover:bg-sky-100
                  cursor-pointer
                "
              >

                <FiPlus size={16} />

                Add Medicine

              </button>

            </div>


            <div className="space-y-4">

              {prescriptions.map(
                (prescription, index) => (

                  <div
                    key={index}
                    className="
                      p-4
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        mb-4
                      "
                    >

                      <p
                        className="
                          text-sm
                          font-bold
                          text-slate-700
                        "
                      >
                        Medicine {index + 1}
                      </p>


                      {prescriptions.length > 1 && (

                        <button
                          type="button"
                          onClick={() =>
                            removePrescription(index)
                          }
                          className="
                            text-red-500
                            hover:text-red-600
                            cursor-pointer
                          "
                        >
                          <FiTrash2 size={17} />
                        </button>

                      )}

                    </div>


                    <div
                      className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        lg:grid-cols-4
                        gap-3
                      "
                    >

                      {/* MEDICINE */}

                      <input
                        type="text"
                        value={
                          prescription.medicineName
                        }
                        onChange={(e) =>
                          handlePrescriptionChange(
                            index,
                            "medicineName",
                            e.target.value
                          )
                        }
                        placeholder="Medicine name"
                        className="
                          px-3
                          py-3
                          bg-white
                          border
                          border-slate-200
                          rounded-lg
                          outline-none
                          focus:border-sky-500
                        "
                      />


                      {/* DOSAGE */}

                      <input
                        type="text"
                        value={
                          prescription.dosage
                        }
                        onChange={(e) =>
                          handlePrescriptionChange(
                            index,
                            "dosage",
                            e.target.value
                          )
                        }
                        placeholder="Dosage e.g. 500mg"
                        className="
                          px-3
                          py-3
                          bg-white
                          border
                          border-slate-200
                          rounded-lg
                          outline-none
                          focus:border-sky-500
                        "
                      />


                      {/* FREQUENCY */}

                      <input
                        type="text"
                        value={
                          prescription.frequency
                        }
                        onChange={(e) =>
                          handlePrescriptionChange(
                            index,
                            "frequency",
                            e.target.value
                          )
                        }
                        placeholder="Frequency e.g. 2x daily"
                        className="
                          px-3
                          py-3
                          bg-white
                          border
                          border-slate-200
                          rounded-lg
                          outline-none
                          focus:border-sky-500
                        "
                      />


                      {/* DURATION */}

                      <input
                        type="text"
                        value={
                          prescription.duration
                        }
                        onChange={(e) =>
                          handlePrescriptionChange(
                            index,
                            "duration",
                            e.target.value
                          )
                        }
                        placeholder="Duration e.g. 5 days"
                        className="
                          px-3
                          py-3
                          bg-white
                          border
                          border-slate-200
                          rounded-lg
                          outline-none
                          focus:border-sky-500
                        "
                      />

                    </div>


                    {/* INSTRUCTIONS */}

                    <input
                      type="text"
                      value={
                        prescription.instructions
                      }
                      onChange={(e) =>
                        handlePrescriptionChange(
                          index,
                          "instructions",
                          e.target.value
                        )
                      }
                      placeholder="Special instructions e.g. Take after food"
                      className="
                        w-full
                        mt-3
                        px-3
                        py-3
                        bg-white
                        border
                        border-slate-200
                        rounded-lg
                        outline-none
                        focus:border-sky-500
                      "
                    />

                  </div>

                )
              )}

            </div>


            {/* PRESCRIPTION UPLOAD */}

            <div className="mt-4">

              <label
                className="
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                  mb-2
                "
              >
                Upload Prescription
              </label>

              <label
                className="
                  flex
                  items-center
                  gap-3
                  p-4
                  border-2
                  border-dashed
                  border-slate-200
                  rounded-xl
                  cursor-pointer
                  hover:border-sky-400
                  hover:bg-sky-50
                  transition
                "
              >

                <FiUpload
                  className="text-sky-600"
                  size={20}
                />

                <div>

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-slate-700
                    "
                  >
                    {prescriptionFile
                      ? prescriptionFile.name
                      : "Choose prescription file"}
                  </p>

                  <p
                    className="
                      text-xs
                      text-slate-400
                      mt-1
                    "
                  >
                    PDF, JPG, PNG
                  </p>

                </div>

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) =>
                    setPrescriptionFile(
                      e.target.files?.[0] || null
                    )
                  }
                />

              </label>

            </div>

          </div>


          {/* =================================================
              TREATMENT NOTES
          ================================================= */}

          <div>

            <h3
              className="
                text-sm
                font-bold
                text-slate-900
                mb-4
              "
            >
              Treatment Notes
            </h3>

            <textarea
              name="treatmentNotes"
              value={medicalForm.treatmentNotes}
              onChange={handleMedicalFormChange}
              rows="4"
              placeholder="Enter treatment provided, advice given, precautions, etc."
              className="
                w-full
                px-4
                py-3
                border
                border-slate-200
                rounded-xl
                outline-none
                resize-none
                focus:border-sky-500
                focus:ring-2
                focus:ring-sky-100
              "
            />

          </div>


          {/* =================================================
              REMARKS
          ================================================= */}

          <div>

            <h3
              className="
                text-sm
                font-bold
                text-slate-900
                mb-4
              "
            >
              Additional Remarks
            </h3>

            <textarea
              name="remarks"
              value={medicalForm.remarks}
              onChange={handleMedicalFormChange}
              rows="3"
              placeholder="Any additional remarks..."
              className="
                w-full
                px-4
                py-3
                border
                border-slate-200
                rounded-xl
                outline-none
                resize-none
                focus:border-sky-500
                focus:ring-2
                focus:ring-sky-100
              "
            />

          </div>


          {/* =================================================
              FOLLOW-UP
          ================================================= */}

          <div
            className="
              p-4
              rounded-xl
              bg-slate-50
              border
              border-slate-200
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <input
                type="checkbox"
                name="followUpRequired"
                checked={
                  medicalForm.followUpRequired
                }
                onChange={handleMedicalFormChange}
                className="
                  w-4
                  h-4
                  accent-sky-600
                "
              />

              <label
                className="
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                Follow-up required
              </label>

            </div>


            {medicalForm.followUpRequired && (

              <div className="mt-4">

                <label
                  className="
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                    mb-2
                  "
                >
                  Follow-up Date
                </label>

                <input
                  type="date"
                  name="followUpDate"
                  value={medicalForm.followUpDate}
                  onChange={handleMedicalFormChange}
                  min={
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                  className="
                    w-full
                    sm:w-1/2
                    px-4
                    py-3
                    border
                    border-slate-200
                    rounded-xl
                    outline-none
                    focus:border-sky-500
                    focus:ring-2
                    focus:ring-sky-100
                  "
                />

              </div>

            )}

          </div>


          {/* =================================================
              OTHER MEDICAL DOCUMENT
          ================================================= */}

          <div>

            <h3
              className="
                text-sm
                font-bold
                text-slate-900
                mb-4
              "
            >
              Other Medical Documents
            </h3>


            <label
              className="
                flex
                items-center
                gap-3
                p-4
                border-2
                border-dashed
                border-slate-200
                rounded-xl
                cursor-pointer
                hover:border-sky-400
                hover:bg-sky-50
                transition
              "
            >

              <FiUpload
                className="text-sky-600"
                size={20}
              />

              <div>

                <p
                  className="
                    text-sm
                    font-semibold
                    text-slate-700
                  "
                >
                  {otherMedicalFile
                    ? otherMedicalFile.name
                    : "Upload other medical document"}
                </p>

                <p
                  className="
                    text-xs
                    text-slate-400
                    mt-1
                  "
                >
                  PDF, JPG, PNG
                </p>

              </div>

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) =>
                  setOtherMedicalFile(
                    e.target.files?.[0] || null
                  )
                }
              />

            </label>

          </div>

        </div>


        {/* =================================================
            FOOTER
        ================================================= */}

        <div
          className="
            px-6
            py-4
            border-t
            border-slate-200
            bg-white
            flex
            flex-col-reverse
            sm:flex-row
            justify-end
            gap-3
            sticky
            bottom-0
          "
        >

          <button
            type="button"
            onClick={closeCompletePopup}
            className="
              px-5
              py-2.5
              bg-slate-100
              hover:bg-slate-200
              text-slate-700
              rounded-xl
              text-sm
              font-semibold
              cursor-pointer
            "
          >
            Cancel
          </button>


          <button
            type="submit"
            className="
              px-5
              py-2.5
              bg-emerald-600
              hover:bg-emerald-700
              text-white
              rounded-xl
              text-sm
              font-semibold
              cursor-pointer
              flex
              items-center
              justify-center
              gap-2
            "
          >

            <FiCheckCircle size={17} />

            Complete Appointment

          </button>

        </div>

      </form>

    </div>

  </div>

)}
{/* =====================================================
    SUCCESS / ERROR NOTIFICATION POPUP
===================================================== */}

{notification.show && (

  <div
    className="
      fixed
      inset-0
      z-[100]
      bg-black/40
      flex
      items-center
      justify-center
      p-4
    "
    onClick={closeNotification}
  >

    <div
      className="
        bg-white
        w-full
        max-w-md
        rounded-2xl
        shadow-2xl
        overflow-hidden
      "
      onClick={(e) => e.stopPropagation()}
    >

      {/* HEADER */}

      <div className="px-6 py-5">

        <div className="flex items-center gap-4">

          {/* ICON */}

          <div
            className={`
              w-12
              h-12
              rounded-full
              flex
              items-center
              justify-center
              shrink-0
              ${
                notification.type === "success"
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-red-100 text-red-600"
              }
            `}
          >

            <FiCheckCircle size={24} />

          </div>

          {/* MESSAGE */}

          <div>

            <h3
              className="
                text-lg
                font-bold
                text-slate-900
              "
            >
              {notification.type === "success"
                ? "Success"
                : "Error"}
            </h3>

            <p
              className="
                text-sm
                text-slate-500
                mt-1
                leading-5
              "
            >
              {notification.message}
            </p>

          </div>

        </div>

      </div>

      {/* FOOTER */}

      <div
        className="
          px-6
          py-4
          border-t
          border-slate-200
          flex
          justify-end
        "
      >

        <button
          type="button"
          onClick={closeNotification}
          className={`
            px-5
            py-2.5
            text-white
            rounded-xl
            text-sm
            font-semibold
            cursor-pointer
            transition
            ${
              notification.type === "success"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-red-600 hover:bg-red-700"
            }
          `}
        >
          OK
        </button>

      </div>

    </div>

  </div>

)}

    </>
  );
};

export default TodayAppointments;