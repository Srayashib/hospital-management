import { useEffect, useState } from "react";

import {
  FiCalendar,
  FiClock,
  FiUser,
  FiMapPin,
  FiFileText,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
} from "react-icons/fi";

import toast from "react-hot-toast";

import {
  getMyAppointments,
} from "../../services/patientProfileService";


const Appointments = () => {

  const [appointments, setAppointments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);
    const [currentPage, setCurrentPage] = useState(1);

const appointmentsPerPage = 5;



  useEffect(() => {

    const loadAppointments = async () => {

      try {

        setLoading(true);

        const response =
          await getMyAppointments();

        setAppointments(
          response.appointments || []
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

      } finally {

        setLoading(false);

      }

    };


    loadAppointments();

  }, []);

  const formatDate = (date) => {

    if (!date) {
      return "";
    }

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

  };
const totalPages = Math.ceil(
  appointments.length / appointmentsPerPage
);

const startIndex =
  (currentPage - 1) * appointmentsPerPage;

const endIndex =
  startIndex + appointmentsPerPage;

const currentAppointments =
  appointments.slice(
    startIndex,
    endIndex
  );

  const getStatusStyle = (status) => {

    switch (status) {

      case "Confirmed":

        return {
          className:
            "bg-emerald-50 text-emerald-700",
          icon: <FiCheckCircle />,
        };


      case "Completed":

        return {
          className:
            "bg-sky-50 text-sky-700",
          icon: <FiCheckCircle />,
        };


      case "Cancelled":

        return {
          className:
            "bg-red-50 text-red-700",
          icon: <FiXCircle />,
        };


      case "Pending":

      default:

        return {
          className:
            "bg-amber-50 text-amber-700",
          icon: <FiAlertCircle />,
        };

    }

  };


  if (loading) {

    return (

      <div className="
        p-4
        sm:p-6
        lg:p-8
        max-w-[1200px]
        mx-auto
      ">

        <div className="
          bg-white
          rounded-2xl
          border border-slate-200
          shadow-sm
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

          <p className="text-slate-500">
            Loading appointments...
          </p>

        </div>

      </div>

    );

  }


  // =====================================================
  // NO APPOINTMENTS
  // =====================================================

  if (appointments.length === 0) {

    return (

      <div className="
        p-4
        sm:p-6
        lg:p-8
        max-w-[1200px]
        mx-auto
      ">

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

            Manage your appointments.

          </p>

        </div>


        <div className="
          bg-white
          rounded-2xl
          border border-slate-200
          shadow-sm
          p-10
          text-center
        ">

          <FiCalendar
            size={45}
            className="
              mx-auto
              text-slate-300
            "
          />

          <h3 className="
            mt-4
            text-lg
            font-semibold
            text-slate-700
          ">

            No appointments yet

          </h3>

          <p className="
            text-sm
            text-slate-400
            mt-1
          ">

            You have not booked any appointments yet.

          </p>

        </div>

      </div>

    );

  }


  // =====================================================
  // APPOINTMENTS
  // =====================================================

  return (

    <div className="
      p-4
      sm:p-6
      lg:p-8
      max-w-[1200px]
      mx-auto
    ">


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

          Manage your appointments.

        </p>

      </div>


      {/* =================================================
          APPOINTMENT LIST
      ================================================= */}

      <div className="
        space-y-5
      ">

        {currentAppointments.map((appointment) => {

          const status =
            getStatusStyle(
              appointment.status
            );


          return (

            <div
              key={appointment._id}
              className="
                bg-white
                rounded-2xl
                border border-slate-200
                shadow-sm
                p-5
                sm:p-6
                hover:shadow-md
                transition
              "
            >

              {/* =================================================
                  TOP
              ================================================= */}

              <div className="
                flex
                flex-col
                sm:flex-row
                sm:items-start
                sm:justify-between
                gap-4
              ">


                {/* Doctor */}

                <div className="
                  flex
                  items-center
                  gap-4
                ">

                  <div className="
                    w-14
                    h-14
                    rounded-2xl
                    overflow-hidden
                    bg-sky-100
                    text-sky-700
                    flex
                    items-center
                    justify-center
                    text-lg
                    font-bold
                    shrink-0
                  ">

                    {appointment.doctor?.image ? (

                      <img
                        src={`http://localhost:5000/uploads/doctors/${appointment.doctor.image}`}
                        alt={`Dr. ${appointment.doctor.name}`}
                        className="
                          w-full
                          h-full
                          object-cover
                        "
                      />

                    ) : (

                      appointment.doctor?.name
                        ?.charAt(0)
                        ?.toUpperCase()

                    )}

                  </div>


                  <div>

                    <h2 className="
                      text-lg
                      font-bold
                      text-slate-900
                    ">

                      Dr. {appointment.doctor?.name}

                    </h2>


                    <p className="
                      text-sm
                      text-sky-600
                      font-medium
                      mt-1
                    ">

                      {appointment.doctor?.department}

                    </p>

                  </div>

                </div>


                {/* Status */}

                <div className={`
                  inline-flex
                  items-center
                  gap-2
                  px-3
                  py-1.5
                  rounded-full
                  text-xs
                  font-semibold
                  self-start
                  ${status.className}
                `}>

                  {status.icon}

                  {appointment.status}

                </div>

              </div>


              {/* =================================================
                  DETAILS
              ================================================= */}

              <div className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                gap-4
                mt-6
                pt-5
                border-t
                border-slate-100
              ">


                {/* Date */}

                <div className="
                  flex
                  items-start
                  gap-3
                ">

                  <div className="
                    w-10
                    h-10
                    rounded-xl
                    bg-sky-50
                    text-sky-600
                    flex
                    items-center
                    justify-center
                    shrink-0
                  ">

                    <FiCalendar />

                  </div>


                  <div>

                    <p className="
                      text-xs
                      text-slate-400
                      mb-1
                    ">

                      Date

                    </p>

                    <p className="
                      text-sm
                      font-semibold
                      text-slate-700
                    ">

                      {formatDate(
                        appointment.date
                      )}

                    </p>

                  </div>

                </div>
                <div className="
                  flex
                  items-start
                  gap-3
                ">
                  
                  <div className="
                    w-10
                    h-10
                    rounded-xl
                    bg-emerald-50
                    text-emerald-600
                    flex
                    items-center
                    justify-center
                    shrink-0
                  ">
                    ₹
                  </div>

                  <div>

                    <p className="
                      text-xs
                      text-slate-400
                      mb-1
                    ">
                      Consultation Fee
                    </p>

                    <p className="
                      text-sm
                      font-semibold
                      text-slate-700
                    ">
                      ₹{appointment.fee ?? 0}
                    </p>

                  </div>

                </div>


                {/* Time */}

                <div className="
                  flex
                  items-start
                  gap-3
                ">

                  <div className="
                    w-10
                    h-10
                    rounded-xl
                    bg-sky-50
                    text-sky-600
                    flex
                    items-center
                    justify-center
                    shrink-0
                  ">

                    <FiClock />

                  </div>


                  <div>

                    <p className="
                      text-xs
                      text-slate-400
                      mb-1
                    ">

                      Time

                    </p>

                    <p className="
                      text-sm
                      font-semibold
                      text-slate-700
                    ">

                      {appointment.startTime}

                      {" - "}

                      {appointment.endTime}

                    </p>

                  </div>

                </div>


                {/* Reason */}

                <div className="
                  flex
                  items-start
                  gap-3
                ">

                  <div className="
                    w-10
                    h-10
                    rounded-xl
                    bg-sky-50
                    text-sky-600
                    flex
                    items-center
                    justify-center
                    shrink-0
                  ">

                    <FiFileText />

                  </div>


                  <div>

                    <p className="
                      text-xs
                      text-slate-400
                      mb-1
                    ">

                      Reason

                    </p>

                    <p className="
                      text-sm
                      font-semibold
                      text-slate-700
                      line-clamp-2
                    ">

                      {appointment.reason}

                    </p>

                  </div>

                </div>

              </div>


              {/* =================================================
                  NOTES
              ================================================= */}

              {appointment.notes && (

                <div className="
                  mt-5
                  p-4
                  rounded-xl
                  bg-slate-50
                  border border-slate-100
                ">

                  <p className="
                    text-xs
                    font-semibold
                    text-slate-500
                    mb-1
                  ">

                    Additional Notes

                  </p>

                  <p className="
                    text-sm
                    text-slate-600
                  ">

                    {appointment.notes}

                  </p>

                </div>

              )}

            </div>

          );

        })}
        {totalPages > 1 && (

  <div className="
    mt-6
    flex
    flex-col
    sm:flex-row
    items-center
    justify-between
    gap-4
  ">

    {/* Showing */}

    <p className="
      text-sm
      text-slate-500
    ">

      Showing{" "}
      {startIndex + 1}
      {" - "}
      {Math.min(
        endIndex,
        appointments.length
      )}
      {" of "}
      {appointments.length}
      {" appointments"}

    </p>


    {/* Pagination */}

    <div className="
      flex
      items-center
      gap-2
    ">

      {/* Previous */}

      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() =>
          setCurrentPage(
            currentPage - 1
          )
        }
        className="
          px-4
          py-2
          rounded-xl
          border
          border-slate-200
          text-sm
          font-semibold
          text-slate-600
          hover:bg-slate-50
          disabled:opacity-40
          disabled:cursor-not-allowed
        "
      >

        Previous

      </button>


      {/* Page numbers */}

      {Array.from(
        { length: totalPages },
        (_, index) => index + 1
      ).map((page) => (

        <button
          key={page}
          type="button"
          onClick={() =>
            setCurrentPage(page)
          }
          className={`
            w-10
            h-10
            rounded-xl
            text-sm
            font-semibold
            transition
            ${
              currentPage === page
                ? "bg-sky-600 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }
          `}
        >

          {page}

        </button>

      ))}


      {/* Next */}

      <button
        type="button"
        disabled={
          currentPage === totalPages
        }
        onClick={() =>
          setCurrentPage(
            currentPage + 1
          )
        }
        className="
          px-4
          py-2
          rounded-xl
          border
          border-slate-200
          text-sm
          font-semibold
          text-slate-600
          hover:bg-slate-50
          disabled:opacity-40
          disabled:cursor-not-allowed
        "
      >

        Next

      </button>

    </div>

  </div>

)}

      </div>

    </div>

  );

};


export default Appointments;