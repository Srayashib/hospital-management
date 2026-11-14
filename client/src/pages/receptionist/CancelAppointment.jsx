import {
  FaCalendarTimes,
  FaSearch,
  FaUserMd,
  FaClock,
  FaTrash,
} from "react-icons/fa";

import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import {
  getReceptionistAppointments,
  deleteCancelledAppointment,
} from "../../services/receptionistService";


const CancelAppointment = () => {

  // =====================================================
  // APPOINTMENTS
  // =====================================================

  const [appointments, setAppointments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  // =====================================================
  // DELETE LOADING
  // =====================================================

  const [deletingId, setDeletingId] =
    useState(null);


  // =====================================================
  // SEARCH
  // =====================================================

  const [search, setSearch] =
    useState("");

  const [searchTerm, setSearchTerm] =
    useState("");


  // =====================================================
  // PAGINATION
  // =====================================================

  const [currentPage, setCurrentPage] =
    useState(1);

  const [itemsPerPage, setItemsPerPage] =
    useState(10);
    const [deleteModal, setDeleteModal] = useState({
      open: false,
      appointmentId: null,
    });


  // =====================================================
  // LOAD CANCELLED APPOINTMENTS
  // =====================================================

  useEffect(() => {

    const loadCancelledAppointments =
      async () => {

        try {

          setLoading(true);

          const response =
            await getReceptionistAppointments(
              "cancelled",
              "all"
            );

          setAppointments(
            response.appointments || []
          );

        } catch (error) {

          console.error(
            "Cancelled appointments loading error:",
            error
          );

          toast.error(
            error.response?.data?.message ||
            "Failed to load cancelled appointments"
          );

          setAppointments([]);

        } finally {

          setLoading(false);

        }

      };


    loadCancelledAppointments();

  }, []);


  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = () => {

    setSearchTerm(
      search.trim().toLowerCase()
    );

    setCurrentPage(1);

  };


  // =====================================================
  // FILTER SEARCH RESULTS
  // =====================================================

  const filteredAppointments =
    appointments.filter(
      (appointment) => {

        if (!searchTerm) {
          return true;
        }


        // ==========================================
        // PATIENT NAME
        // ==========================================

        const patientName =
          appointment.patient?.name
            ?.toLowerCase() || "";


        // ==========================================
        // PATIENT PHONE
        // ==========================================

        const patientPhone =
          appointment.patient?.phone
            ?.toLowerCase() || "";


        // ==========================================
        // APPOINTMENT ID
        // ==========================================

        const appointmentId =
          appointment._id
            ?.toLowerCase() || "";


        // ==========================================
        // DOCTOR NAME
        // ==========================================

        const doctorName =
          appointment.doctor?.name
            ?.toLowerCase() || "";


        // ==========================================
        // DEPARTMENT
        // ==========================================

        const department =
          appointment.doctor?.department
            ?.toLowerCase() || "";


        return (
          patientName.includes(searchTerm) ||
          patientPhone.includes(searchTerm) ||
          appointmentId.includes(searchTerm) ||
          doctorName.includes(searchTerm) ||
          department.includes(searchTerm)
        );

      }
    );


  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages =
    Math.ceil(
      filteredAppointments.length /
      itemsPerPage
    );


  const startIndex =
    (currentPage - 1) *
    itemsPerPage;


  const endIndex =
    startIndex +
    itemsPerPage;


  const currentAppointments =
    filteredAppointments.slice(
      startIndex,
      endIndex
    );


  // =====================================================
  // DELETE APPOINTMENT
  // =====================================================


    const handleDelete = (appointmentId) => {

      setDeleteModal({
        open: true,
        appointmentId,
      });

    };



    const confirmDelete = async () => {

      const appointmentId =
        deleteModal.appointmentId;

      if (!appointmentId) {
        return;
      }

      try {

        setDeletingId(appointmentId);

        // ==========================================
        // DELETE FROM DATABASE
        // ==========================================

        await deleteCancelledAppointment(
          appointmentId
        );

        // ==========================================
        // REMOVE FROM FRONTEND
        // ==========================================

        setAppointments(
          (prevAppointments) =>
            prevAppointments.filter(
              (appointment) =>
                appointment._id !== appointmentId
            )
        );

        toast.success(
          "Cancelled appointment deleted successfully."
        );

        // ==========================================
        // CLOSE MODAL
        // ==========================================

        setDeleteModal({
          open: false,
          appointmentId: null,
        });

      } catch (error) {

        console.error(
          "Delete appointment error:",
          error
        );

        toast.error(
          error.response?.data?.message ||
          "Failed to delete appointment."
        );

      } finally {

        setDeletingId(null);

      }

    };


// =====================================================
// CANCEL DELETE
// =====================================================

const cancelDelete = () => {

  if (deletingId) {
    return;
  }

  setDeleteModal({
    open: false,
    appointmentId: null,
  });

};


  // =====================================================
  // ITEMS PER PAGE
  // =====================================================

  const handleItemsPerPageChange =
    (e) => {

      setItemsPerPage(
        Number(e.target.value)
      );

      setCurrentPage(1);

    };


  // =====================================================
  // KEEP PAGE VALID AFTER DELETE
  // =====================================================

  useEffect(() => {

    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {

      setCurrentPage(totalPages);

    }

  }, [
    totalPages,
    currentPage,
  ]);


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

          Cancelled Appointments

        </h1>


        <p className="
          text-slate-500
          mt-2
        ">

          View and manage all cancelled patient
          appointments.

        </p>

      </div>


      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="
        bg-white
        rounded-2xl
        border
        border-slate-200
        shadow-sm
        p-6
        mb-6
      ">

        <label className="
          block
          text-sm
          font-semibold
          text-slate-700
          mb-2
        ">

          Search Cancelled Appointment

        </label>


        <div className="
          flex
          flex-col
          sm:flex-row
          gap-3
        ">


          {/* SEARCH INPUT */}

          <div className="
            relative
            flex-1
          ">

            <FaSearch className="
              absolute
              left-3
              top-3.5
              text-slate-400
            " />


            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              onKeyDown={(e) => {

                if (e.key === "Enter") {

                  handleSearch();

                }

              }}
              placeholder="Search by patient name, phone, doctor or appointment ID"
              className="
                w-full
                pl-10
                pr-4
                py-3
                border
                border-slate-200
                rounded-xl
                text-sm
                outline-none
                focus:border-sky-500
                focus:ring-2
                focus:ring-sky-100
              "
            />

          </div>


          {/* SEARCH BUTTON */}

          <button
            type="button"
            onClick={handleSearch}
            className="
              px-6
              py-3
              bg-sky-600
              hover:bg-sky-700
              text-white
              rounded-xl
              text-sm
              font-semibold
              cursor-pointer
            "
          >

            Search

          </button>

        </div>

      </div>


      {/* =================================================
          APPOINTMENT CONTAINER
      ================================================= */}

      <div className="
        bg-white
        rounded-2xl
        border
        border-slate-200
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
          items-center
          justify-between
        ">

          <div>

            <h2 className="
              text-lg
              font-bold
              text-slate-900
            ">

              Cancelled Appointments

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

            </p>

          </div>

        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (

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

              Loading cancelled appointments...

            </p>

          </div>

        )}


        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading &&
          filteredAppointments.length === 0 && (

          <div className="
            p-10
            text-center
          ">

            <FaCalendarTimes
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

              No cancelled appointments found

            </h3>


            <p className="
              text-sm
              text-slate-400
              mt-1
            ">

              There are no cancelled appointments
              matching your search.

            </p>

          </div>

        )}


        {/* =================================================
            APPOINTMENTS
        ================================================= */}

        {!loading &&
          currentAppointments.length > 0 && (

          <div className="
            divide-y
            divide-slate-100
          ">


            {currentAppointments.map(
              (appointment) => (

              <div
                key={appointment._id}
                className="
                  p-5
                  hover:bg-slate-50
                  transition
                "
              >

                <div className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  xl:grid-cols-6
                  gap-5
                  items-center
                ">


                  {/* =================================================
                      PATIENT
                  ================================================= */}

                  <div>

                    <p className="
                      text-xs
                      text-slate-400
                      uppercase
                      font-semibold
                    ">

                      Patient

                    </p>


                    <h3 className="
                      text-lg
                      font-bold
                      text-slate-900
                      mt-1
                    ">

                      {appointment.patient?.name ||
                        "Unknown Patient"}

                    </h3>


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


                  {/* =================================================
                      DOCTOR
                  ================================================= */}

                  <div>

                    <p className="
                      text-xs
                      text-slate-400
                      uppercase
                      font-semibold
                    ">

                      Doctor

                    </p>


                    <div className="
                      flex
                      items-center
                      gap-2
                      mt-1
                      text-sm
                      text-slate-700
                    ">

                      <FaUserMd
                        className="text-sky-600"
                      />

                      Dr.{" "}
                      {appointment.doctor?.name ||
                        "Unknown Doctor"}

                    </div>


                    <p className="
                      text-xs
                      text-slate-400
                      mt-1
                    ">

                      {appointment.doctor?.department ||
                        "Department"}

                    </p>

                  </div>


                  {/* =================================================
                      DATE
                  ================================================= */}

                  <div>

                    <p className="
                      text-xs
                      text-slate-400
                      uppercase
                      font-semibold
                    ">

                      Date

                    </p>


                    <p className="
                      text-sm
                      text-slate-700
                      mt-1
                    ">

                      {formatDate(
                        appointment.date
                      )}

                    </p>

                  </div>


                  {/* =================================================
                      TIME
                  ================================================= */}

                  <div>

                    <p className="
                      text-xs
                      text-slate-400
                      uppercase
                      font-semibold
                    ">

                      Time

                    </p>


                    <div className="
                      flex
                      items-center
                      gap-2
                      mt-1
                      text-sm
                      text-slate-700
                    ">

                      <FaClock
                        className="text-slate-400"
                      />

                      {appointment.startTime ||
                        "-"}

                      {" - "}

                      {appointment.endTime ||
                        "-"}

                    </div>

                  </div>


                  {/* =================================================
                      STATUS
                  ================================================= */}

                  <div>

                    <p className="
                      text-xs
                      text-slate-400
                      uppercase
                      font-semibold
                      mb-1
                    ">

                      Status

                    </p>


                    <span className="
                      inline-flex
                      items-center
                      gap-2
                      px-3
                      py-1.5
                      rounded-full
                      text-xs
                      font-semibold
                      bg-red-50
                      text-red-700
                    ">

                      <FaCalendarTimes />

                      Cancelled

                    </span>

                  </div>


                  {/* =================================================
                      DELETE
                  ================================================= */}

                  <div className="
                    flex
                    
                    
                  ">

                    <button
                      type="button"
                      disabled={
                        deletingId ===
                        appointment._id
                      }
                      onClick={() =>
                        handleDelete(
                          appointment._id
                        )
                      }
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        px-4
                        py-2.5
                        bg-red-50
                        hover:bg-red-100
                        text-red-600
                        border
                        border-red-100
                        rounded-xl
                        text-sm
                        font-semibold
                        transition
                        cursor-pointer
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                      "
                    >

                      {deletingId ===
                      appointment._id ? (

                        <>
                          <span className="
                            w-4
                            h-4
                            border-2
                            border-red-200
                            border-t-red-600
                            rounded-full
                            animate-spin
                          " />

                          Deleting...

                        </>

                      ) : (

                        <>
                          <FaTrash />

                          Delete

                        </>

                      )}

                    </button>

                  </div>

                </div>


                {/* =================================================
                    APPOINTMENT ID
                ================================================= */}

                <div className="
                  mt-4
                  pt-3
                  border-t
                  border-slate-100
                ">

                  <p className="
                    text-xs
                    text-slate-400
                  ">

                    Appointment ID:

                    <span className="
                      ml-1
                      font-mono
                      text-slate-500
                    ">

                      {appointment._id}

                    </span>

                  </p>

                </div>

              </div>

            ))}

          </div>

        )}


        {/* =================================================
            PAGINATION
        ================================================= */}

        {!loading &&
          filteredAppointments.length > 0 && (

          <div className="
            px-5
            py-4
            border-t
            border-slate-200
            flex
            flex-col
            lg:flex-row
            items-center
            justify-between
            gap-4
          ">


            {/* =================================================
                LEFT SIDE
            ================================================= */}

            <div className="
              flex
              flex-wrap
              items-center
              justify-center
              gap-3
              text-sm
              text-slate-500
            ">

              <span>

                Showing{" "}

                <span className="
                  font-semibold
                  text-slate-700
                ">

                  {startIndex + 1}

                </span>

                {" - "}

                <span className="
                  font-semibold
                  text-slate-700
                ">

                  {Math.min(
                    endIndex,
                    filteredAppointments.length
                  )}

                </span>

                {" of "}

                <span className="
                  font-semibold
                  text-slate-700
                ">

                  {filteredAppointments.length}

                </span>

              </span>


              {/* =================================================
                  ITEMS PER PAGE
              ================================================= */}

              <div className="
                flex
                items-center
                gap-2
              ">

                <span>
                  Show
                </span>


                <select
                  value={itemsPerPage}
                  onChange={
                    handleItemsPerPageChange
                  }
                  className="
                    border
                    border-slate-200
                    rounded-lg
                    px-2
                    py-1.5
                    text-sm
                    text-slate-600
                    bg-white
                    outline-none
                    focus:border-sky-500
                    focus:ring-2
                    focus:ring-sky-100
                  "
                >

                  <option value={5}>
                    5
                  </option>

                  <option value={10}>
                    10
                  </option>

                  <option value={20}>
                    20
                  </option>

                  <option value={50}>
                    50
                  </option>

                </select>


                <span>
                  per page
                </span>

              </div>

            </div>


            {/* =================================================
                RIGHT SIDE
            ================================================= */}

            <div className="
              flex
              items-center
              gap-1
            ">


              {/* PREVIOUS */}

              <button
                type="button"
                disabled={
                  currentPage === 1
                }
                onClick={() =>
                  setCurrentPage(
                    (prev) => prev - 1
                  )
                }
                className="
                  px-3
                  py-2
                  rounded-lg
                  border
                  border-slate-200
                  text-sm
                  font-medium
                  text-slate-600
                  hover:bg-slate-50
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                "
              >

                Previous

              </button>


              {/* PAGE NUMBERS */}

              <div className="
                flex
                items-center
                gap-1
              ">

                {Array.from(
                  {
                    length: totalPages,
                  },
                  (_, index) => {

                    const page =
                      index + 1;


                    return (

                      <button
                        key={page}
                        type="button"
                        onClick={() =>
                          setCurrentPage(
                            page
                          )
                        }
                        className={`
                          w-9
                          h-9
                          rounded-lg
                          text-sm
                          font-semibold
                          transition
                          ${
                            currentPage === page
                              ? "bg-sky-600 text-white shadow-sm"
                              : "text-slate-600 hover:bg-slate-100"
                          }
                        `}
                      >

                        {page}

                      </button>

                    );

                  }
                )}

              </div>


              {/* NEXT */}

              <button
                type="button"
                disabled={
                  currentPage === totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (prev) => prev + 1
                  )
                }
                className="
                  px-3
                  py-2
                  rounded-lg
                  border
                  border-slate-200
                  text-sm
                  font-medium
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


      {/* =================================================
          DELETE CONFIRMATION MODAL
      ================================================= */}

      {deleteModal.open && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/50
            px-4
          "
          onClick={cancelDelete}
        >

          <div
            className="
              w-full
              max-w-md
              bg-white
              rounded-2xl
              shadow-2xl
              p-6
              relative
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* =================================================
                ICON
            ================================================= */}

            <div className="
              w-14
              h-14
              mx-auto
              flex
              items-center
              justify-center
              rounded-full
              bg-red-50
              text-red-600
              mb-5
            ">

              <FaTrash size={22} />

            </div>


            {/* =================================================
                TITLE
            ================================================= */}

            <h2 className="
              text-xl
              font-bold
              text-slate-900
              text-center
            ">

              Delete Cancelled Appointment?

            </h2>


            {/* =================================================
                MESSAGE
            ================================================= */}

            <p className="
              text-sm
              text-slate-500
              text-center
              mt-3
              leading-6
            ">

              Are you sure you want to permanently
              delete this cancelled appointment?

              <br />

              This action cannot be undone.

            </p>


            {/* =================================================
                BUTTONS
            ================================================= */}

            <div className="
              flex
              items-center
              justify-end
              gap-3
              mt-7
            ">

              {/* CANCEL */}

              <button
                type="button"
                onClick={cancelDelete}
                disabled={!!deletingId}
                className="
                  px-5
                  py-2.5
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  text-slate-600
                  text-sm
                  font-semibold
                  hover:bg-slate-50
                  transition
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  cursor-pointer
                "
              >

                Cancel

              </button>


              {/* DELETE */}

              <button
                type="button"
                onClick={confirmDelete}
                disabled={!!deletingId}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-5
                  py-2.5
                  rounded-xl
                  bg-red-600
                  hover:bg-red-700
                  text-white
                  text-sm
                  font-semibold
                  transition
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  cursor-pointer
                "
              >

                {deletingId ? (

                  <>

                    <span className="
                      w-4
                      h-4
                      border-2
                      border-red-200
                      border-t-white
                      rounded-full
                      animate-spin
                    " />

                    Deleting...

                  </>

                ) : (

                  <>

                    <FaTrash />

                    Delete

                  </>

                )}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};


export default CancelAppointment;