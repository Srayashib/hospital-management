import {
  FaCalendarCheck,
  FaUserMd,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";

import {
  getAppointmentSummary,
  getReceptionistAppointments,
  updateAppointmentStatus,
} from "../../services/receptionistService";

import { useState, useEffect } from "react";

import toast from "react-hot-toast";
import "./receptionistAppointments.css";

const Appointments = () => {

  // =====================================================
  // SUMMARY
  // =====================================================

  const [summary, setSummary] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
  });


  const [loadingSummary, setLoadingSummary] =
    useState(true);


  // =====================================================
  // ACTIVE FILTER
  // TODAY IS DEFAULT
  // =====================================================

  // const [activeFilter, setActiveFilter] =
  //   useState("today");

  const [activeFilter, setActiveFilter] =
    useState("all");
  const [selectedDate, setSelectedDate] =
  useState("");

  const [activeDepartment, setActiveDepartment] =
    useState("all");

  const [departmentCounts, setDepartmentCounts] =
    useState([]);


  // =====================================================
  // APPOINTMENTS
  // =====================================================

  const [appointments, setAppointments] =
    useState([]);


  const [loadingAppointments, setLoadingAppointments] =
    useState(true);
  const [updatingAppointmentId, setUpdatingAppointmentId] =
   useState(null);


  // =====================================================
  // LOAD SUMMARY
  // =====================================================

//  useEffect(() => {

//   const loadAppointments = async () => {

//     try {

//       setLoadingAppointments(true);

//       const response =
//         await getReceptionistAppointments(
//           activeFilter,
//           activeDepartment
//         );

//       setAppointments(
//         response.appointments || []
//       );

//       setDepartmentCounts(
//         response.departmentCounts || []
//       );

//     } catch (error) {

//       console.error(
//         "Appointments loading error:",
//         error
//       );

//       toast.error(
//         error.response?.data?.message ||
//         "Failed to load appointments"
//       );

//       setAppointments([]);
//       setDepartmentCounts([]);

//     } finally {

//       setLoadingAppointments(false);

//     }

//   };

//   loadAppointments();

// }, [
//   activeFilter,
//   activeDepartment
// ]);


useEffect(() => {

  const loadAppointments = async () => {

    try {

      setLoadingAppointments(true);

      const response =
        await getReceptionistAppointments(
          activeFilter,
          activeDepartment
        );

      setAppointments(
        response.appointments || []
      );

      setDepartmentCounts(
        response.departmentCounts || []
      );

    } catch (error) {

      console.error(
        "Appointments loading error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to load appointments"
      );

      setAppointments([]);

      setDepartmentCounts([]);

    } finally {

      setLoadingAppointments(false);

    }

  };

  loadAppointments();

}, [
  activeFilter,
  activeDepartment
]);

useEffect(() => {

  const loadAppointmentSummary = async () => {

    try {

      setLoadingSummary(true);

      const response =
        await getAppointmentSummary();

      setSummary(
        response.summary || {
          totalAppointments: 0,
          todayAppointments: 0,
          pendingAppointments: 0,
        }
      );

    } catch (error) {

      console.error(
        "Appointment summary loading error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to load appointment summary"
      );

    } finally {

      setLoadingSummary(false);

    }

  };

  loadAppointmentSummary();

}, []);


  // =====================================================
  // CARD CLICK
  // =====================================================

  // const handleFilterChange = (filter) => {

  //   setActiveFilter(filter);

  // };
  const handleFilterChange = (filter) => {

  setActiveFilter(filter);

  // Calendar date filter is only for All Appointments
  if (filter !== "all") {
    setSelectedDate("");
  }

};

  const handleDepartmentChange = (department) => {

    setActiveDepartment(department);

  };
// =====================================================
// UPDATE APPOINTMENT STATUS
// =====================================================

  const handleStatusChange = async (
    appointmentId,
    status
  ) => {

    try {

      setUpdatingAppointmentId(
        appointmentId
      );

      const response =
        await updateAppointmentStatus(
          appointmentId,
          status
        );

      toast.success(
        response.message ||
        "Appointment status updated."
      );


      // =================================================
      // REMOVE/REFRESH FROM CURRENT LIST
      // =================================================

      const appointmentsResponse =
        await getReceptionistAppointments(
          activeFilter,
          activeDepartment
        );

      setAppointments(
        appointmentsResponse.appointments || []
      );

      setDepartmentCounts(
        appointmentsResponse.departmentCounts || []
      );


      // =================================================
      // REFRESH SUMMARY
      // =================================================

      const summaryResponse =
        await getAppointmentSummary();

      setSummary(
        summaryResponse.summary || {
          totalAppointments: 0,
          todayAppointments: 0,
          pendingAppointments: 0,
        }
      );

    } catch (error) {

      console.error(
        "Appointment status update error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to update appointment status."
      );

    } finally {

      setUpdatingAppointmentId(null);

    }

  };

  // =====================================================
  // CARD BASE CLASS
  // =====================================================

  const getCardClass = (filter) => {

    const isActive =
      activeFilter === filter;

    return `
      bg-white
      rounded-2xl
      border
      p-5
      shadow-sm
      cursor-pointer
      transition
      ${
        isActive
          ? "border-sky-500 ring-2 ring-sky-100 shadow-md"
          : "border-slate-200 hover:border-sky-300 hover:shadow-md"
      }
    `;
  };


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
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );

  };
  const getAppointmentDateKey = (date) => {

  if (!date) {
    return "";
  }

  const appointmentDate =
    new Date(date);

  const year =
    appointmentDate.getFullYear();

  const month = String(
    appointmentDate.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    appointmentDate.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
const filteredAppointments =
  activeFilter === "all" && selectedDate
    ? appointments.filter(
        (appointment) =>
          getAppointmentDateKey(
            appointment.date
          ) === selectedDate
      )
    : appointments;

  return (

    <div className="p-4 sm:p-6 lg:p-8">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-7">

        <h1 className="
          text-2xl
          sm:text-3xl
          font-bold
          text-slate-900
        ">

          Appointments

        </h1>


        <p className="
          text-slate-500
          mt-2
        ">

          View and manage all patient appointments.

        </p>

      </div>


      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        gap-5
        mb-6
      ">


        {/* =================================================
            TODAY
        ================================================= */}

        <div
          onClick={() =>
            handleFilterChange("today")
          }
          className={getCardClass("today")}
        >

          <div className="
            flex
            items-center
            gap-4
          ">

            <div className="
              w-12
              h-12
              rounded-xl
              bg-sky-100
              text-sky-600
              flex
              items-center
              justify-center
            ">

              <FaCalendarCheck />

            </div>


            <div>

              <p className="
                text-sm
                text-slate-500
              ">

                Today's Appointments

              </p>


              <h3 className="
                text-2xl
                font-bold
                text-slate-900
                mt-1
              ">

                {loadingSummary
                  ? "..."
                  : summary.todayAppointments}

              </h3>

            </div>

          </div>

        </div>


        {/* =================================================
            PENDING
        ================================================= */}

        <div
          onClick={() =>
            handleFilterChange("pending")
          }
          className={getCardClass("pending")}
        >

          <div className="
            flex
            items-center
            gap-4
          ">

            <div className="
              w-12
              h-12
              rounded-xl
              bg-amber-100
              text-amber-600
              flex
              items-center
              justify-center
            ">

              <FaClock />

            </div>


            <div>

              <p className="
                text-sm
                text-slate-500
              ">

                Pending

              </p>


              <h3 className="
                text-2xl
                font-bold
                text-amber-600
                mt-1
              ">

                {loadingSummary
                  ? "..."
                  : summary.pendingAppointments}

              </h3>

            </div>

          </div>

        </div>


        {/* =================================================
            ALL
        ================================================= */}

        <div
          onClick={() =>
            handleFilterChange("all")
          }
          className={getCardClass("all")}
        >

          <div className="
            flex
            items-center
            gap-4
          ">

            <div className="
              w-12
              h-12
              rounded-xl
              bg-slate-100
              text-slate-600
              flex
              items-center
              justify-center
            ">

              <FaCalendarCheck />

            </div>


            <div>

              <p className="
                text-sm
                text-slate-500
              ">

                Total Appointments

              </p>


              <h3 className="
                text-2xl
                font-bold
                text-slate-900
                mt-1
              ">

                {loadingSummary
                  ? "..."
                  : summary.totalAppointments}

              </h3>

            </div>

          </div>

        </div>

      </div>



      <div className="
        bg-white
        rounded-2xl
        border border-slate-200
        shadow-sm
        p-4
        mb-6
      ">

        <div className="
          flex
          items-center
          gap-3
          overflow-x-auto
          pb-1
        ">

          {/* ALL */}

          <button
            onClick={() =>
              handleDepartmentChange("all")
            }
            className={`
              flex
              items-center
              gap-2
              whitespace-nowrap
              px-4
              py-2.5
              rounded-xl
              text-sm
              font-semibold
              transition
              border
              ${
                activeDepartment === "all"
                  ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-sky-50 hover:text-sky-600"
              }
            `}
          >

            <span>
              All
            </span>

            <span
              className={`
                px-2
                py-0.5
                rounded-full
                text-xs
                ${
                  activeDepartment === "all"
                    ? "bg-white/20 text-white"
                    : "bg-slate-200 text-slate-600"
                }
              `}
            >
              {loadingAppointments
                ? "..."
                : (
                    activeFilter === "all"
                      ? summary.totalAppointments
                      : activeFilter === "today"
                      ? summary.todayAppointments
                      : summary.pendingAppointments
                  )
              }
            </span>

          </button>


          {/* DEPARTMENTS */}

          {departmentCounts.map(
            (department) => (

              <button
                key={department.name}
                onClick={() =>
                  handleDepartmentChange(
                    department.name
                  )
                }
                className={`
                  flex
                  items-center
                  gap-2
                  whitespace-nowrap
                  px-4
                  py-2.5
                  rounded-xl
                  text-sm
                  font-semibold
                  transition
                  border
                  ${
                    activeDepartment ===
                    department.name
                      ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-sky-50 hover:text-sky-600"
                  }
                `}
              >

                <span>
                  {department.name}
                </span>

                <span
                  className={`
                    px-2
                    py-0.5
                    rounded-full
                    text-xs
                    ${
                      activeDepartment ===
                      department.name
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 text-slate-600"
                    }
                  `}
                >
                  {department.count}
                </span>

              </button>

            )
          )}

        </div>

      </div>


      {/* =================================================
          APPOINTMENT LIST
      ================================================= */}

      <div className="
        bg-white
        rounded-2xl
        border border-slate-200
        shadow-sm
        overflow-hidden
      ">


        {/* =================================================
            LIST HEADER
        ================================================= */}

        <div className="
  p-5
  border-b
  border-slate-200
  flex
  flex-col
  sm:flex-row
  sm:items-center
  sm:justify-between
  gap-4
">

  <div>

    <h2 className="
      text-lg
      font-bold
      text-slate-900
    ">

      {activeFilter === "today"
        ? "Today's Appointments"
        : activeFilter === "pending"
        ? "Pending Appointments"
        : selectedDate
        ? "Appointments by Date"
        : "All Appointments"}

    </h2>

    <p className="
      text-sm
      text-slate-500
      mt-1
    ">

      {filteredAppointments.length} appointment
      {filteredAppointments.length !== 1
        ? "s"
        : ""}

      {selectedDate && (
        <>
          {" "}on{" "}
          {new Date(
            `${selectedDate}T00:00:00`
          ).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </>
      )}

    </p>

  </div>

  {/* CALENDAR */}

  {activeFilter === "all" && (

    <div className="appointment-calendar-wrapper">

      <div className="appointment-calendar-input">

        <FaCalendarAlt />

        <input
          type="date"
          value={selectedDate}
          onChange={(e) =>
            setSelectedDate(e.target.value)
          }
        />

      </div>

      {selectedDate && (

        <button
          type="button"
          className="appointment-calendar-clear"
          onClick={() =>
            setSelectedDate("")
          }
        >
          Clear
        </button>

      )}

    </div>

  )}

</div>


        {/* =================================================
            LOADING
        ================================================= */}

        {loadingAppointments && (

          <div className="
            p-10
            text-center
          ">

            <div className="
              w-10
              h-10
              border-4
              border-sky-100
              border-t-sky-600
              rounded-full
              animate-spin
              mx-auto
              mb-4
            " />

            <p className="
              text-slate-500
            ">

              Loading appointments...

            </p>

          </div>

        )}


        {/* =================================================
            EMPTY
        ================================================= */}

        {!loadingAppointments &&
          filteredAppointments.length === 0 && (

          <div className="
  p-10
  text-center
">

  <FaCalendarCheck
    size={40}
    className="
      mx-auto
      text-slate-300
      mb-4
    "
  />

  <h3 className="
    font-semibold
    text-slate-700
  ">

    {selectedDate
      ? "No appointments on this date"
      : "No appointments found"}

  </h3>

  <p className="
    text-sm
    text-slate-400
    mt-1
  ">

    {selectedDate
      ? "There are no appointments scheduled for the selected date."
      : "There are no appointments in this section."}

  </p>

</div>

        )}


    

        {!loadingAppointments &&
  filteredAppointments.length > 0 && (

  <div className="
    divide-y
    divide-slate-100
  ">

    {filteredAppointments.map((appointment) => (

              <div
                key={appointment._id}
                className="
                  p-5
                  hover:bg-slate-50
                  transition
                "
              >

                <div className="
                  flex
                  flex-col
                  lg:flex-row
                  lg:items-center
                  lg:justify-between
                  gap-4
                ">


                  {/* PATIENT */}

                  <div>

                    <h3 className="
                      font-bold
                      text-slate-900
                    ">

                      {appointment.patient?.name ||
                        "Unknown Patient"}

                    </h3>


                    <p className="
                      text-sm
                      text-sky-600
                      mt-1
                    ">

                      {appointment.doctor?.department ||
                        "Department"}

                    </p>


                    {appointment.patient?.phone && (

                      <p className="
                        text-xs
                        text-slate-400
                        mt-1
                      ">

                        {appointment.patient.phone}

                      </p>

                    )}

                  </div>


                  {/* DOCTOR */}

                  <div className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-slate-600
                  ">

                    <FaUserMd
                      className="text-slate-400"
                    />

                    Dr.{" "}
                    {appointment.doctor?.name ||
                      "Unknown Doctor"}

                  </div>


                  {/* DATE */}

                  <div className="
                    text-sm
                    text-slate-600
                  ">

                    {formatDate(
                      appointment.date
                    )}

                  </div>


                  {/* TIME */}

                  <div className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-slate-600
                  ">

                    <FaClock
                      className="text-slate-400"
                    />

                    {appointment.startTime}
                    {" - "}
                    {appointment.endTime}

                  </div>


                  {/* STATUS */}


                  <div>

                    <span
                      className={`
                        inline-flex
                        px-3
                        py-1.5
                        rounded-full
                        text-xs
                        font-semibold
                        ${
                          appointment.status === "Confirmed"
                            ? "bg-emerald-50 text-emerald-700"
                            : appointment.status === "Pending"
                            ? "bg-amber-50 text-amber-700"
                            : appointment.status === "Completed"
                            ? "bg-sky-50 text-sky-700"
                            : "bg-red-50 text-red-700"
                        }
                      `}
                    >

                      {appointment.status}

                    </span>

                  </div>
{/* =================================================
PAYMENT
================================================= */}

<div className="appointment-payment-cell">

  {appointment.paymentStatus === "Paid" ? (

    <div className="appointment-payment-paid">

      <span className="appointment-payment-badge paid">
        Paid
      </span>

      <span className="appointment-payment-method">
        {appointment.paymentMethod === "Card"
          ? "Card"
          : appointment.paymentMethod === "QR"
          ? "QR"
          : appointment.paymentMethod === "PayPal"
          ? "PayPal"
          : appointment.paymentMethod || "-"}
      </span>

      <span className="appointment-payment-amount">
        $
        {Number(
          appointment.paymentAmount ||
          appointment.fee ||
          0
        ).toFixed(2)}
      </span>

    </div>

  ) : (

    <div className="appointment-payment-pending">

      <span className="appointment-payment-badge pending">
        Not Completed
      </span>

      <span className="appointment-payment-amount pending-amount">
        $
        {Number(
          appointment.fee || 0
        ).toFixed(2)}
      </span>

    </div>

  )}

</div>

                  {/* =================================================
                      ACTION
                      ONLY SHOW IN PENDING FILTER
                  ================================================= */}

                  {activeFilter === "pending" && (

                    <div className="flex items-center gap-2">

                      <select
                        value={appointment.status}
                        disabled={
                          updatingAppointmentId ===
                          appointment._id
                        }
                        onChange={(e) =>
                          handleStatusChange(
                            appointment._id,
                            e.target.value
                          )
                        }
                        className="
                          px-3
                          py-2
                          text-sm
                          font-medium
                          text-slate-700
                          bg-white
                          border
                          border-slate-200
                          rounded-lg
                          outline-none
                          focus:ring-2
                          focus:ring-sky-100
                          focus:border-sky-500
                          disabled:opacity-50
                          disabled:cursor-not-allowed
                        "
                      >

                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Confirmed">
                          Confirmed
                        </option>

                        <option value="Completed">
                          Completed
                        </option>

                        <option value="Cancelled">
                          Cancelled
                        </option>

                      </select>

                      {updatingAppointmentId ===
                        appointment._id && (

                        <div className="
                          w-4
                          h-4
                          border-2
                          border-sky-100
                          border-t-sky-600
                          rounded-full
                          animate-spin
                        " />

                      )}

                    </div>

                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  );

};


export default Appointments;