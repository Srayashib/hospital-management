import { useEffect, useState } from "react";

import {
  FaCalendarAlt,
  FaUserMd,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaBan,
} from "react-icons/fa";

import {
  getAllLeaves,
  approveLeave,
  rejectLeave,
} from "../../services/leaveService";


const Leaves = () => {

  const [leaves, setLeaves] = useState([]);

  const [loading, setLoading] = useState(true);

  const [processingId, setProcessingId] = useState(null);

  const [popup, setPopup] = useState({
        show: false,
        type: "",
        message: "",
        leaveId: null,
      });


  // ==========================================
  // LOAD ALL LEAVES
  // ==========================================

  useEffect(() => {

    loadLeaves();

  }, []);


  const loadLeaves = async () => {

    try {

      setLoading(true);

      const response = await getAllLeaves();

    //   console.log("ALL LEAVES:", response);

      setLeaves(response.leaves || []);

    } catch (error) {

      console.error(
        "Get All Leaves Error:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // FORMAT DATE
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
  // CALCULATE DAYS
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
// CHECK IF ADMIN CAN PROCESS LEAVE
// ==========================================

const canProcessLeave = (leave) => {

  // Only Pending leaves can be processed
  if (leave.status !== "Pending") {
    return false;
  }


  // Get today
  const today = new Date();

  today.setHours(0, 0, 0, 0);


  // Leave start date
  const startDate = new Date(
    leave.startDate
  );

  startDate.setHours(0, 0, 0, 0);


  // Only future leaves can be processed
  return startDate > today;

};
// ==========================================
// APPROVE LEAVE
// ==========================================

const handleApprove = async (leaveId) => {

  setPopup({
    show: true,
    type: "confirmApprove",
    message: "Are you sure you want to approve this leave?",
    leaveId,
  });

};
// ==========================================
// REJECT LEAVE
// ==========================================

const handleReject = async (leaveId) => {

  setPopup({
    show: true,
    type: "confirmReject",
    message: "Are you sure you want to reject this leave?",
    leaveId,
  });

};
// ==========================================
// CONFIRM APPROVE
// ==========================================

const confirmApprove = async () => {

  try {

    setProcessingId(popup.leaveId);

    const response = await approveLeave(
      popup.leaveId
    );

    setPopup({
      show: true,
      type: "success",
      message:
        response.message ||
        "Leave approved successfully.",
      leaveId: null,
    });

    await loadLeaves();

  } catch (error) {

    console.error(
      "Approve Leave Error:",
      error
    );

    setPopup({
      show: true,
      type: "error",
      message:
        error.response?.data?.message ||
        "Unable to approve leave.",
      leaveId: null,
    });

  } finally {

    setProcessingId(null);

  }

};


// ==========================================
// CONFIRM REJECT
// ==========================================

const confirmReject = async () => {

  try {

    setProcessingId(popup.leaveId);

    const response = await rejectLeave(
      popup.leaveId
    );

    setPopup({
      show: true,
      type: "success",
      message:
        response.message ||
        "Leave rejected successfully.",
      leaveId: null,
    });

    await loadLeaves();

  } catch (error) {

    console.error(
      "Reject Leave Error:",
      error
    );

    setPopup({
      show: true,
      type: "error",
      message:
        error.response?.data?.message ||
        "Unable to reject leave.",
      leaveId: null,
    });

  } finally {

    setProcessingId(null);

  }

};


// ==========================================
// CLOSE POPUP
// ==========================================

const closePopup = () => {

  setPopup({
    show: false,
    type: "",
    message: "",
    leaveId: null,
  });

};


  // ==========================================
  // STATUS
  // ==========================================

  const getStatusClass = (status) => {

    switch (status) {

      case "Approved":
        return "bg-green-50 text-green-700 border-green-200";

      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200";

      case "Cancelled by Doctor":
        return "bg-slate-100 text-slate-600 border-slate-200";

      default:
        return "bg-orange-50 text-orange-700 border-orange-200";

    }

  };


  const getStatusIcon = (status) => {

    switch (status) {

      case "Approved":
        return <FaCheckCircle />;

      case "Rejected":
        return <FaTimesCircle />;

      case "Cancelled by Doctor":
        return <FaBan />;

      default:
        return <FaClock />;

    }

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="p-6">

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 text-center">

          <p className="text-slate-500">
            Loading leave applications...
          </p>

        </div>

      </div>

    );

  }


  return (
    <>

    <div className="p-6">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>

          <h1 className="text-2xl font-bold text-slate-800">
            Leave Applications
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            View all leave applications submitted by doctors.
          </p>

        </div>


        <div className="px-4 py-2 rounded-xl bg-sky-50 border border-sky-100">

          <span className="text-sm font-semibold text-sky-600">

            {leaves.length} Applications

          </span>

        </div>

      </div>


      {/* =====================================
          TABLE CARD
      ===================================== */}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">


        {/* =====================================
            DESKTOP TABLE
        ===================================== */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[950px]">

            <thead>

              <tr className="bg-slate-50 border-b border-slate-200">

                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Doctor
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Leave Type
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Leave Period
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Days
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Reason
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Action
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-slate-100">

              {leaves.length > 0 ? (

                leaves.map((leave) => {

                  const days = calculateDays(
                    leave.startDate,
                    leave.endDate
                  );


                  return (

                    <tr
                      key={leave._id}
                      className="hover:bg-slate-50 transition"
                    >

                      {/* DOCTOR */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center">

                            <FaUserMd />

                          </div>


                          <div>

                            <p className="font-semibold text-slate-800">

                              {leave.doctor?.name ||
                                "Unknown Doctor"}

                            </p>

                            <p className="text-xs text-slate-400">

                              {leave.doctor?.email ||
                                "No email"}

                            </p>

                          </div>

                        </div>

                      </td>


                      {/* LEAVE TYPE */}

                      <td className="px-6 py-5">

                        <span className="font-semibold text-slate-700">

                          {leave.leaveType}

                        </span>

                      </td>


                      {/* DATES */}

                      <td className="px-6 py-5">

                        <div className="flex items-start gap-3">

                          <FaCalendarAlt className="text-sky-500 mt-1" />

                          <div>

                            <p className="text-sm font-semibold text-slate-700">

                              {formatDate(
                                leave.startDate
                              )}

                            </p>

                            <p className="text-xs text-slate-400">

                              to{" "}

                              {formatDate(
                                leave.endDate
                              )}

                            </p>

                          </div>

                        </div>

                      </td>


                      {/* DAYS */}

                      <td className="px-6 py-5">

                        <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold">

                          {days}{" "}

                          {days === 1
                            ? "Day"
                            : "Days"}

                        </span>

                      </td>


                      {/* REASON */}

                      <td className="px-6 py-5 max-w-[250px]">

                        <p className="text-sm text-slate-600 truncate">

                          {leave.reason ||
                            "No reason provided"}

                        </p>

                      </td>


                      {/* STATUS */}

                      <td className="px-6 py-5">

                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${getStatusClass(
                            leave.status
                          )}`}
                        >

                          {getStatusIcon(
                            leave.status
                          )}

                          {leave.status}

                        </span>

                      </td>
                      {/* ACTION */}

                          <td className="px-6 py-5">

                            {canProcessLeave(leave) ? (

                              <div className="flex items-center gap-2">

                                {/* APPROVE */}

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleApprove(leave._id)
                                  }
                                  disabled={
                                    processingId === leave._id
                                  }
                                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 text-green-700 border border-green-200 text-xs font-semibold hover:bg-green-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >

                                  <FaCheckCircle />

                                  {processingId === leave._id
                                    ? "Processing..."
                                    : "Approve"}

                                </button>


                                {/* REJECT */}

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleReject(leave._id)
                                  }
                                  disabled={
                                    processingId === leave._id
                                  }
                                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-semibold hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >

                                  <FaTimesCircle />

                                  Reject

                                </button>

                              </div>

                            ) : (

                              <span className="text-xs text-slate-400">
                                No action
                              </span>

                            )}

                          </td>

                    </tr>

                  );

                })

              ) : (

                <tr>

                  <td
                    colSpan="7"
                    className="px-6 py-16 text-center"
                  >

                    <div className="flex flex-col items-center">

                      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 text-xl mb-4">

                        <FaCalendarAlt />

                      </div>

                      <h3 className="font-semibold text-slate-700">

                        No Leave Applications

                      </h3>

                      <p className="text-sm text-slate-400 mt-1">

                        No doctors have submitted leave applications yet.

                      </p>

                    </div>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
    {/* ==========================================
    CUSTOM POPUP
========================================== */}

{popup.show && (

  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">

    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">

      {/* ICON */}

      <div className="flex justify-center mb-4">

        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl
          ${
            popup.type === "confirmApprove"
              ? "bg-green-100 text-green-600"
              : popup.type === "confirmReject"
              ? "bg-red-100 text-red-600"
              : popup.type === "success"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >

          {popup.type === "confirmApprove" && (
            <FaCheckCircle />
          )}

          {popup.type === "confirmReject" && (
            <FaTimesCircle />
          )}

          {popup.type === "success" && (
            <FaCheckCircle />
          )}

          {popup.type === "error" && (
            <FaTimesCircle />
          )}

        </div>

      </div>


      {/* TITLE */}

      <h2 className="text-xl font-bold text-slate-800 text-center mb-2">

        {popup.type === "confirmApprove"
          ? "Approve Leave"
          : popup.type === "confirmReject"
          ? "Reject Leave"
          : popup.type === "success"
          ? "Success"
          : "Error"}

      </h2>


      {/* MESSAGE */}

      <p className="text-sm text-slate-500 text-center mb-6">

        {popup.message}

      </p>


      {/* BUTTONS */}

      {(popup.type === "confirmApprove" ||
        popup.type === "confirmReject") ? (

        <div className="flex justify-center gap-3">

          {/* CANCEL */}

          <button
            type="button"
            onClick={closePopup}
            className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition"
          >
            Cancel
          </button>


          {/* CONFIRM */}

          <button
            type="button"
            onClick={
              popup.type === "confirmApprove"
                ? confirmApprove
                : confirmReject
            }
            disabled={processingId === popup.leaveId}
            className={`px-5 py-2.5 rounded-xl text-white font-semibold transition disabled:opacity-50
              ${
                popup.type === "confirmApprove"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              }`}
          >

            {processingId === popup.leaveId
              ? "Processing..."
              : popup.type === "confirmApprove"
              ? "Yes, Approve"
              : "Yes, Reject"}

          </button>

        </div>

      ) : (

        <div className="flex justify-center">

          <button
            type="button"
            onClick={closePopup}
            className="px-6 py-2.5 rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-600 transition"
          >
            OK
          </button>

        </div>

      )}

    </div>

  </div>

)}
</>
  );

};


export default Leaves;