import {
FaUserCheck,
FaSearch,
FaUser,
FaUserMd,
FaCalendarAlt,
FaClock,
FaCheckCircle,
} from "react-icons/fa";

import { useEffect, useState } from "react";

import {
getReceptionistAppointments,
updateAppointmentStatus,
} from "../../services/receptionistService";

const PatientCheckIn = () => {

const [search, setSearch] = useState("");

const [debouncedSearch, setDebouncedSearch] = useState("");
const [checkedIn, setCheckedIn] = useState(null);

const [appointments, setAppointments] = useState([]);

const [loading, setLoading] = useState(false);

const [checkingIn, setCheckingIn] = useState(null);

// =====================================================
// FILTER TODAY'S APPOINTMENTS
// =====================================================

// const filteredAppointments = appointments
// .filter((appointment) => {

//   /*
//    * Show patients who are:
//    *
//    * Confirmed
//    * OR
//    * Already Checked In
//    */

//   return (
//     appointment.status === "Confirmed" ||
//     appointment.status === "Checked In"
//   );

// })

// .filter((appointment) => {

//   const term = search.trim().toLowerCase();

//   if (!term) {
//     return true;
//   }


//   // =====================================================
//   // PATIENT NAME
//   // =====================================================

//   const patientName =
//     typeof appointment.patient === "object"
//       ? appointment.patient?.name || ""
//       : appointment.patient || "";


//   // =====================================================
//   // PATIENT ID
//   // =====================================================

//   const patientId =
//     typeof appointment.patient === "object"
//       ? appointment.patient?._id || ""
//       : appointment.patientId || "";


//   // =====================================================
//   // APPOINTMENT ID
//   // =====================================================

//   const appointmentId =
//     appointment._id ||
//     appointment.id ||
//     "";


//   return (
//     String(patientName)
//       .toLowerCase()
//       .includes(term) ||

//     String(patientId)
//       .toLowerCase()
//       .includes(term) ||

//     String(appointmentId)
//       .toLowerCase()
//       .includes(term)
//   );

// });

const filteredAppointments = appointments.filter(
  (appointment) => {

    const term = search.trim().toLowerCase();

    if (!term) {
      return true;
    }

    const patientName =
      typeof appointment.patient === "object"
        ? appointment.patient?.name || ""
        : appointment.patient || "";

    const patientId =
      typeof appointment.patient === "object"
        ? appointment.patient?._id || ""
        : appointment.patientId || "";

    const appointmentId =
      appointment._id ||
      appointment.id ||
      "";

    return (
      String(patientName)
        .toLowerCase()
        .includes(term) ||

      String(patientId)
        .toLowerCase()
        .includes(term) ||

      String(appointmentId)
        .toLowerCase()
        .includes(term)
    );

  }
);

console.log(
  "Appointments received:",
  appointments
);

console.log(
  "Appointments shown:",
  filteredAppointments
);
// =====================================================
// CHECK IN PATIENT
// =====================================================

const handleCheckIn = async (appointmentId) => {


try {

  if (!appointmentId) {
    return;
  }

  setCheckingIn(appointmentId);


  console.log(
    "Checking in appointment:",
    appointmentId
  );


  // =====================================================
  // UPDATE BACKEND
  // =====================================================

  const response =
    await updateAppointmentStatus(
      appointmentId,
      "Checked In"
    );


  console.log(
    "Check-in response:",
    response
  );


  // =====================================================
  // UPDATE FRONTEND
  // =====================================================

  setAppointments((prevAppointments) => {

    return prevAppointments.map(
      (appointment) => {

        const currentId =
          appointment._id ||
          appointment.id;

        if (
          String(currentId) ===
          String(appointmentId)
        ) {

          return {
            ...appointment,
            status: "Checked In",
          };

        }

        return appointment;

      }
    );

  });


  setCheckedIn(appointmentId);


} catch (error) {

  console.error(
    "Failed to check in patient:",
    error
  );

  console.error(
    "Backend response:",
    error?.response?.data
  );

  alert(
    error?.response?.data?.message ||
    "Failed to check in patient."
  );

} finally {

  setCheckingIn(null);

}


};
useEffect(() => {

  const timer = setTimeout(() => {

    setDebouncedSearch(
      search.trim()
    );

  }, 3000);


  return () => {
    clearTimeout(timer);
  };

}, [search]);
// =====================================================
// LOAD TODAY'S APPOINTMENTS
// =====================================================

useEffect(() => {


const loadAppointments = async () => {

  try {

    setLoading(true);


    console.log(
      "Loading today's receptionist appointments..."
    );


    const response =
      await getReceptionistAppointments(
        "today",
        "all"
      );


    console.log(
      "Patient Check-In API response:",
      response
    );


    const receivedAppointments =
      response?.appointments || [];


    console.log(
      "Today's appointments:",
      receivedAppointments
    );


    receivedAppointments.forEach(
      (appointment) => {

        console.log(
          "Appointment ID:",
          appointment._id,

          "Patient:",
          appointment.patient?.name,

          "Status:",
          appointment.status,

          "Date:",
          appointment.date
        );

      }
    );


    setAppointments(
      receivedAppointments
    );


  } catch (error) {

    console.error(
      "Failed to load appointments:",
      error
    );

    console.error(
      "Backend response:",
      error?.response?.data
    );

    setAppointments([]);

  } finally {

    setLoading(false);

  }

};


loadAppointments();


}, []);

// =====================================================
// FORMAT DATE
// =====================================================

const formatDate = (date) => {


if (!date) {
  return "-";
}

return new Date(date).toLocaleDateString(
  "en-US",
  {
    month: "short",
    day: "numeric",
    year: "numeric",
  }
);


};

// =====================================================
// RENDER
// =====================================================

return (


<div className="p-4 sm:p-6 lg:p-8">


  {/* =====================================================
      HEADER
  ===================================================== */}

  <div className="mb-7">

    <h1
      className="
        text-2xl
        sm:text-3xl
        font-bold
        text-slate-900
      "
    >
      Patient Check-In
    </h1>

    <p
      className="
        text-slate-500
        mt-2
      "
    >
      Check in patients when they arrive for their appointment.
    </p>

  </div>


  {/* =====================================================
      SEARCH CARD
  ===================================================== */}

  <div
    className="
      bg-white
      rounded-2xl
      border
      border-slate-200
      shadow-sm
      p-6
      mb-6
    "
  >

    <label
      className="
        block
        text-sm
        font-semibold
        text-slate-700
        mb-2
      "
    >
      Search Patient or Appointment
    </label>


    <div
      className="
        relative
        max-w-2xl
      "
    >

      <FaSearch
        className="
          absolute
          left-3
          top-3.5
          text-slate-400
        "
      />


      <input
        type="text"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        placeholder="
          Search by patient name, patient ID or appointment ID
        "
        className="
          w-full
          pl-10
          pr-4
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


  {/* =====================================================
      APPOINTMENTS CARD
  ===================================================== */}

  <div
    className="
      bg-white
      rounded-2xl
      border
      border-slate-200
      shadow-sm
      overflow-hidden
    "
  >

    {/* HEADER */}

    <div
      className="
        p-5
        border-b
        border-slate-200
      "
    >

      <h2
        className="
          text-lg
          font-bold
          text-slate-900
        "
      >
        Today's Patient Appointments
      </h2>

      <p
        className="
          text-sm
          text-slate-500
          mt-1
        "
      >
        Select an appointment to check in the patient.
      </p>

    </div>


    {/* =====================================================
        LOADING
    ===================================================== */}

    {loading ? (

      <div
        className="
          p-10
          text-center
          text-slate-500
        "
      >
        Loading today's appointments...
      </div>

    ) : filteredAppointments.length === 0 ? (

      /* =====================================================
         EMPTY
      ===================================================== */

      <div
        className="
          p-10
          text-center
        "
      >

        <FaCalendarAlt
          className="
            mx-auto
            text-3xl
            text-slate-300
            mb-3
          "
        />

        <p
          className="
            font-semibold
            text-slate-600
          "
        >
          No patients found
        </p>

        <p
          className="
            text-sm
            text-slate-400
            mt-1
          "
        >
          There are no confirmed or checked-in appointments for today.
        </p>

      </div>

    ) : (

      /* =====================================================
         APPOINTMENT LIST
      ===================================================== */

      <div
        className="
          divide-y
          divide-slate-100
        "
      >

        {filteredAppointments.map(
          (appointment) => {

            const appointmentId =
              appointment._id ||
              appointment.id ||
              "";


            const isCheckedIn =
              appointment.status ===
                "Checked In" ||
              checkedIn === appointmentId;


            const isCheckingIn =
              checkingIn === appointmentId;


            return (

              <div
                key={appointmentId}
                className="
                  p-5
                  hover:bg-slate-50
                  transition
                "
              >

                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-5
                    gap-5
                    items-center
                  "
                >


                  {/* =================================================
                      PATIENT
                  ================================================= */}

                  <div>

                    <p
                      className="
                        text-xs
                        text-slate-400
                        uppercase
                        font-semibold
                      "
                    >
                      Patient
                    </p>


                    <div
                      className="
                        flex
                        items-center
                        gap-3
                        mt-1
                      "
                    >

                      <div
                        className="
                          w-10
                          h-10
                          rounded-full
                          bg-sky-50
                          text-sky-600
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <FaUser />
                      </div>


                      <div>

                        <h3
                          className="
                            font-bold
                            text-slate-900
                          "
                        >
                          {appointment.patient?.name ||
                            "Unknown Patient"}
                        </h3>


                        <p
                          className="
                            text-xs
                            text-slate-400
                          "
                        >
                          {appointment.patient?._id ||
                            appointment.patientId ||
                            "-"}
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* =================================================
                      DOCTOR
                  ================================================= */}

                  <div>

                    <p
                      className="
                        text-xs
                        text-slate-400
                        uppercase
                        font-semibold
                      "
                    >
                      Doctor
                    </p>


                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        mt-2
                        text-sm
                        text-slate-700
                      "
                    >

                      <FaUserMd
                        className="text-sky-600"
                      />

                      {appointment.doctor?.name ||
                        "Unknown Doctor"}

                    </div>


                    <p
                      className="
                        text-xs
                        text-slate-400
                        mt-1
                      "
                    >
                      {appointment.doctor?.department ||
                        "-"}
                    </p>

                  </div>


                  {/* =================================================
                      DATE / TIME
                  ================================================= */}

                  <div>

                    <p
                      className="
                        text-xs
                        text-slate-400
                        uppercase
                        font-semibold
                      "
                    >
                      Appointment
                    </p>


                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        text-sm
                        text-slate-700
                        mt-2
                      "
                    >

                      <FaCalendarAlt
                        className="text-slate-400"
                      />

                      {formatDate(
                        appointment.date
                      )}

                    </div>


                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        text-sm
                        text-slate-600
                        mt-1
                      "
                    >

                      <FaClock
                        className="text-slate-400"
                      />

                      {appointment.startTime ||
                        "-"}{" "}

                      -{" "}

                      {appointment.endTime ||
                        "-"}

                    </div>

                  </div>


                  {/* =================================================
                      STATUS
                  ================================================= */}

                  <div>

                    <p
                      className="
                        text-xs
                        text-slate-400
                        uppercase
                        font-semibold
                        mb-2
                      "
                    >
                      Status
                    </p>


                    {isCheckedIn ? (

                      <span
                        className="
                          inline-flex
                          items-center
                          gap-2
                          px-3
                          py-1.5
                          rounded-full
                          text-xs
                          font-semibold
                          bg-green-50
                          text-green-700
                        "
                      >

                        <FaCheckCircle />

                        Checked In

                      </span>

                    ) : (

                      <span
                        className="
                          inline-flex
                          items-center
                          gap-2
                          px-3
                          py-1.5
                          rounded-full
                          text-xs
                          font-semibold
                          bg-amber-50
                          text-amber-700
                        "
                      >

                        Waiting

                      </span>

                    )}

                  </div>


                  {/* =================================================
                      ACTION
                  ================================================= */}

                  <div
                    className="
                      flex
                      justify-start
                      xl:justify-end
                    "
                  >

                    <button
                      type="button"
                      disabled={
                        isCheckedIn ||
                        isCheckingIn
                      }
                      onClick={() =>
                        handleCheckIn(
                          appointmentId
                        )
                      }
                      className={`
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        px-5
                        py-2.5
                        rounded-xl
                        text-sm
                        font-semibold
                        transition

                        ${
                          isCheckedIn
                            ? `
                              bg-green-50
                              text-green-600
                              cursor-not-allowed
                            `
                            : isCheckingIn
                            ? `
                              bg-slate-100
                              text-slate-500
                              cursor-wait
                            `
                            : `
                              bg-sky-600
                              text-white
                              hover:bg-sky-700
                              cursor-pointer
                            `
                        }
                      `}
                    >

                      {isCheckedIn ? (

                        <>

                          <FaCheckCircle />

                          Checked In

                        </>

                      ) : isCheckingIn ? (

                        <>

                          Checking In...

                        </>

                      ) : (

                        <>

                          <FaUserCheck />

                          Check In

                        </>

                      )}

                    </button>

                  </div>

                </div>


                {/* =================================================
                    APPOINTMENT ID
                ================================================= */}

                <div
                  className="
                    mt-4
                    pt-3
                    border-t
                    border-slate-100
                  "
                >

                  <p
                    className="
                      text-xs
                      text-slate-400
                    "
                  >

                    Appointment ID:

                    <span
                      className="
                        ml-1
                        font-mono
                        text-slate-500
                      "
                    >
                      {appointmentId}
                    </span>

                  </p>

                </div>

              </div>

            );

          }
        )}

      </div>

    )}

  </div>

</div>


);

};

export default PatientCheckIn;
