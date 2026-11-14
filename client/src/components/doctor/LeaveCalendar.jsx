import { useEffect, useState } from "react";

import {
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaBan,
} from "react-icons/fa";

import {
  getMyLeaves,
  cancelLeave,
} from "../../services/leaveService";


const LeaveCalendar = () => {

  const [leaves, setLeaves] = useState([]);

  const [loading, setLoading] = useState(true);

  const [cancellingId, setCancellingId] = useState(null);

  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  


  // ==========================================
  // Load Leaves
  // ==========================================

  useEffect(() => {

    loadLeaves();

  }, []);


  const loadLeaves = async () => {

    try {

      const response = await getMyLeaves();

      console.log("MY LEAVES:", response);

      setLeaves(response.leaves || []);
      setCurrentPage(1);

    } catch (error) {

      console.error(
        "Get Leaves Error:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // Format Date
  // ==========================================

  const formatDate = (date) => {

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };


  // ==========================================
  // Calculate Days
  // ==========================================

  const calculateDays = (
    startDate,
    endDate
  ) => {

    const start = new Date(startDate);

    const end = new Date(endDate);

    const difference =
      end.getTime() - start.getTime();

    return (
      Math.floor(
        difference /
        (1000 * 60 * 60 * 24)
      ) + 1
    );

  };


  // ==========================================
  // Check If Leave Can Be Cancelled
  // ==========================================

  const canCancelLeave = (leave) => {

    // Already cancelled
    if (
      leave.status ===
      "Cancelled by Doctor"
    ) {
      return false;
    }


    // Rejected leave
    if (
      leave.status === "Rejected"
    ) {
      return false;
    }


    // Get today
    const today = new Date();

    today.setHours(0, 0, 0, 0);


    // Leave start date
    const startDate =
      new Date(leave.startDate);

    startDate.setHours(0, 0, 0, 0);


    // Only future leave can be cancelled
    return startDate > today;

  };


  

  // ==========================================
// OPEN CANCEL CONFIRMATION POPUP
// ==========================================

const handleCancelLeave = (leaveId) => {

  setSelectedLeaveId(leaveId);

  setShowConfirmPopup(true);

};


// ==========================================
// CONFIRM CANCEL LEAVE
// ==========================================

const confirmCancelLeave = async () => {

  setShowConfirmPopup(false);

  try {

    setCancellingId(selectedLeaveId);

    const response = await cancelLeave(
      selectedLeaveId
    );

    setPopupMessage(
      response.message ||
      "Leave cancelled successfully."
    );

    setPopupType("success");

    setShowMessagePopup(true);

    // Refresh leaves from database
    await loadLeaves();

  } catch (error) {

    console.error(
      "Cancel Leave Error:",
      error
    );

    setPopupMessage(
      error.response?.data?.message ||
      "Unable to cancel leave."
    );

    setPopupType("error");

    setShowMessagePopup(true);

  } finally {

    setCancellingId(null);

    setSelectedLeaveId(null);

  }

};

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {

    return (
      

      <div className="doctor-leave-history-card">

        <div className="doctor-no-leaves">

          <p>
            Loading leave applications...
          </p>

        </div>

      </div>

    );

  }


  // ==========================================
// PAGINATION
// ==========================================



const leavesPerPage = 10;

const totalPages = Math.ceil(
  leaves.length / leavesPerPage
);

const startIndex =
  (currentPage - 1) * leavesPerPage;

const endIndex =
  startIndex + leavesPerPage;

const currentLeaves =
  leaves.slice(startIndex, endIndex);


  return (
    <>

    <div className="doctor-leave-history-card">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="doctor-leave-section-header">

        <div>

          <h3>
            Leave History
          </h3>

          <p>
            View your previous and current
            leave applications.
          </p>

        </div>


        <div className="doctor-leave-count">

          {leaves.length} Applications

        </div>

      </div>


      {/* =====================================
          LEAVE LIST
      ===================================== */}

      <div className="doctor-leave-list">

        {leaves.length > 0 ? (

          currentLeaves.map((leave) => {

            const days =
              calculateDays(
                leave.startDate,
                leave.endDate
              );


            return (

              <div
                key={leave._id}
                className="doctor-leave-item"
              >

                {/* =================================
                    DATE
                ================================= */}

                <div className="doctor-leave-date">

                  <div className="doctor-leave-date-icon">

                    <FaCalendarAlt />

                  </div>


                  <div>

                    <strong>
                      {formatDate(
                        leave.startDate
                      )}
                    </strong>


                    {leave.startDate !==
                      leave.endDate && (

                      <span>
                        to{" "}
                        {formatDate(
                          leave.endDate
                        )}
                      </span>

                    )}


                    <span>

                      {days}{" "}
                      {days === 1
                        ? "Day"
                        : "Days"}

                    </span>

                  </div>

                </div>


                {/* =================================
                    REASON
                ================================= */}

                <div className="doctor-leave-reason">

                  <span className="doctor-leave-label">
                    Leave Type
                  </span>


                  <strong>
                    {leave.leaveType}
                  </strong>


                  {leave.reason && (

                    <p>
                      {leave.reason}
                    </p>

                  )}


                  {leave.description && (

                    <p>
                      {leave.description}
                    </p>

                  )}

                </div>


                {/* =================================
                    STATUS
                ================================= */}

                <div className="doctor-leave-status-wrapper">

                  <span className="doctor-leave-label">
                    Status
                  </span>


                  <span
                    className={`doctor-leave-status doctor-leave-status-${leave.status
                      .toLowerCase()
                      .replaceAll(" ", "-")}`}
                  >

                    {leave.status ===
                      "Pending" && (
                      <FaClock />
                    )}


                    {leave.status ===
                      "Approved" && (
                      <FaCheckCircle />
                    )}


                    {leave.status ===
                      "Rejected" && (
                      <FaTimesCircle />
                    )}


                    {leave.status ===
                      "Cancelled by Doctor" && (
                      <FaBan />
                    )}


                    <span>
                      {leave.status}
                    </span>

                  </span>


                  {/* =================================
                      CANCEL BUTTON
                  ================================= */}

                  {canCancelLeave(leave) && (

                    <button
                      type="button"
                      className="doctor-leave-cancel-request-btn"
                      onClick={() =>
                        handleCancelLeave(
                          leave._id
                        )
                      }
                      disabled={
                        cancellingId ===
                        leave._id
                      }
                    >

                      <FaBan />

                      {cancellingId ===
                      leave._id
                        ? "Cancelling..."
                        : "Cancel Request"}

                    </button>

                  )}

                </div>

              </div>

            );

          })

        ) : (

          <div className="doctor-no-leaves">

            <div>
              <FaCalendarAlt />
            </div>


            <h4>
              No Leave Applications
            </h4>


            <p>
              You haven't submitted any
              leave applications yet.
            </p>

          </div>

        )}

            </div>


      {/* =====================================
          PAGINATION
      ===================================== */}

      {leaves.length > leavesPerPage && (

        <div className="flex items-center justify-between px-6 py-5 border-t border-slate-200">

          {/* PREVIOUS BUTTON */}

          <button
            type="button"
            onClick={() => {
              setCurrentPage((prev) =>
                Math.max(prev - 1, 1)
              );
            }}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>


          {/* PAGE NUMBERS */}

          <div className="flex items-center gap-2">

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (

              <button
                key={page}
                type="button"
                onClick={() => {
                  setCurrentPage(page);
                }}
                className={`w-10 h-10 rounded-xl text-sm font-semibold transition ${
                  currentPage === page
                    ? "bg-sky-500 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {page}
              </button>

            ))}

          </div>


          {/* NEXT BUTTON */}

          <button
            type="button"
            onClick={() => {
              setCurrentPage((prev) =>
                Math.min(prev + 1, totalPages)
              );
            }}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>

        </div>

      )}


    </div>


    {/* =====================================
        CANCEL CONFIRMATION POPUP
    ===================================== */}

{showConfirmPopup && (

  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">

    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">

      {/* ICON */}

      <div className="flex justify-center mb-4">

        <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-xl">

          <FaBan />

        </div>

      </div>


      {/* TITLE */}

      <h3 className="text-xl font-bold text-slate-800 text-center">

        Cancel Leave Request?

      </h3>


      {/* MESSAGE */}

      <p className="text-sm text-slate-500 text-center mt-2">

        Are you sure you want to cancel this leave request?

      </p>


      {/* BUTTONS */}

      <div className="flex gap-3 mt-6">

        <button
          type="button"
          onClick={() => {
            setShowConfirmPopup(false);
            setSelectedLeaveId(null);
          }}
          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition"
        >

          No, Keep It

        </button>


        <button
          type="button"
          onClick={confirmCancelLeave}
          className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition"
        >

          Yes, Cancel

        </button>

      </div>

    </div>

  </div>

)}
    </>

  );

};


export default LeaveCalendar;