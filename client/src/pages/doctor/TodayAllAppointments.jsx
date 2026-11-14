import React, { useEffect, useState } from "react";

import {
  FaCalendarCheck,
  FaClock,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaStethoscope,
  FaFileMedical,
  FaExclamationCircle,
  FaSyncAlt,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import {
  getMyAllTodayAppointments,
} from "../../services/doctorService";


const TodayAllAppointments = () => {

  const navigate = useNavigate();

  const [appointments, setAppointments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =====================================================
  // FETCH TODAY'S APPOINTMENTS
  // =====================================================

  const fetchAppointments = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await getMyAllTodayAppointments();

      console.log(
        "Today's all appointments:",
        response
      );

      setAppointments(
        response?.appointments || []
      );

    } catch (error) {

      console.error(
        "Failed to fetch today's appointments:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to load today's appointments."
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    fetchAppointments();

  }, []);


  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusClass = (status) => {

    switch (status) {

      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "Confirmed":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "Checked In":
        return "bg-purple-50 text-purple-700 border-purple-200";

      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }

  };


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {

    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );

  };


  // =====================================================
  // EMPTY / LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

        <div className="max-w-7xl mx-auto">

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10">

            <div className="flex flex-col items-center justify-center">

              <div className="w-9 h-9 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin" />

              <p className="mt-4 text-sm text-slate-500">
                Loading today's appointments...
              </p>

            </div>

          </div>

        </div>

      </div>

    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (

      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

        <div className="max-w-7xl mx-auto">

          <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-6">

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">

              <div className="w-11 h-11 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">

                <FaExclamationCircle />

              </div>

              <div>

                <h3 className="font-semibold text-slate-800">
                  Unable to load appointments
                </h3>

                <p className="text-sm text-red-600 mt-1">
                  {error}
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={fetchAppointments}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 transition"
            >
              <FaSyncAlt />
              Try Again
            </button>

          </div>

        </div>

      </div>

    );

  }


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

      <div className="max-w-7xl mx-auto">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

          <div>

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">

                <FaCalendarCheck size={20} />

              </div>

              <div>

                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Today's All Appointments
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                  All appointments scheduled for you today.
                </p>

              </div>

            </div>

          </div>


          {/* REFRESH */}

          <button
            type="button"
            onClick={fetchAppointments}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:border-sky-300 hover:text-sky-600 transition shadow-sm"
          >
            <FaSyncAlt />
            Refresh
          </button>

        </div>


        {/* =================================================
            SUMMARY
        ================================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Today's Total
            </p>

            <p className="text-3xl font-bold text-slate-900 mt-2">
              {appointments.length}
            </p>

          </div>


          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Pending
            </p>

            <p className="text-3xl font-bold text-amber-600 mt-2">

              {
                appointments.filter(
                  (appointment) =>
                    appointment.status === "Pending"
                ).length
              }

            </p>

          </div>


          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Checked In
            </p>

            <p className="text-3xl font-bold text-purple-600 mt-2">

              {
                appointments.filter(
                  (appointment) =>
                    appointment.status === "Checked In"
                ).length
              }

            </p>

          </div>


          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Completed
            </p>

            <p className="text-3xl font-bold text-emerald-600 mt-2">

              {
                appointments.filter(
                  (appointment) =>
                    appointment.status === "Completed"
                ).length
              }

            </p>

          </div>

        </div>


        {/* =================================================
            NO APPOINTMENTS
        ================================================= */}

        {appointments.length === 0 ? (

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10">

            <div className="flex flex-col items-center justify-center text-center">

              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">

                <FaCalendarCheck size={25} />

              </div>

              <h3 className="text-lg font-semibold text-slate-800">
                No Appointments Today
              </h3>

              <p className="text-sm text-slate-500 mt-2">
                You don't have any appointments scheduled for today.
              </p>

            </div>

          </div>

        ) : (

          /* =================================================
             APPOINTMENTS
          ================================================= */

          <div className="space-y-4">

            {appointments.map(
              (appointment, index) => (

                <div
                  key={appointment._id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition"
                >

                  <div className="p-5 sm:p-6">

                    <div className="flex flex-col lg:flex-row lg:items-center gap-5">


                      {/* TIME */}

                      <div className="lg:w-40 shrink-0">

                        <div className="flex items-center gap-2 text-sky-600">

                          <FaClock />

                          <span className="text-lg font-bold">

                            {appointment.startTime ||
                              appointment.slot?.startTime ||
                              "N/A"}

                          </span>

                        </div>

                        <p className="text-xs text-slate-400 mt-1 ml-5">

                          {appointment.endTime ||
                            appointment.slot?.endTime ||
                            "N/A"}

                        </p>

                      </div>


                      {/* PATIENT */}

                      <div className="flex-1 min-w-0">

                        <div className="flex flex-wrap items-center gap-3">

                          <h2 className="text-lg font-bold text-slate-900">

                            {appointment.patient?.name ||
                              "Unknown Patient"}

                          </h2>

                          <span
                            className={`px-3 py-1 rounded-full border text-xs font-semibold ${getStatusClass(
                              appointment.status
                            )}`}
                          >
                            {appointment.status ||
                              "Unknown"}
                          </span>

                        </div>


                        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 text-sm text-slate-500">

                          <span className="flex items-center gap-2">

                            <FaPhone className="text-sky-500" />

                            {appointment.patient?.phone ||
                              "N/A"}

                          </span>


                          <span className="flex items-center gap-2">

                            <FaEnvelope className="text-sky-500" />

                            {appointment.patient?.email ||
                              "N/A"}

                          </span>

                        </div>

                      </div>


                      {/* ACTION */}

                      <div className="shrink-0">

                        {appointment.patient?._id && (

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/doctor/medical-record/${appointment.patient._id}`
                              )
                            }
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 text-white rounded-xl text-sm font-semibold hover:bg-sky-700 transition"
                          >

                            <FaFileMedical />

                            Medical Record

                          </button>

                        )}

                      </div>

                    </div>


                    {/* DETAILS */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-100">


                      {/* DATE */}

                      <div className="bg-slate-50 rounded-xl p-4">

                        <div className="flex items-center gap-2 text-slate-400 text-xs">

                          <FaCalendarCheck />

                          Date

                        </div>

                        <p className="text-sm font-semibold text-slate-800 mt-1">

                          {formatDate(
                            appointment.date
                          )}

                        </p>

                      </div>


                      {/* REASON */}

                      <div className="bg-slate-50 rounded-xl p-4">

                        <div className="flex items-center gap-2 text-slate-400 text-xs">

                          <FaStethoscope />

                          Reason

                        </div>

                        <p className="text-sm font-semibold text-slate-800 mt-1">

                          {appointment.reason ||
                            "N/A"}

                        </p>

                      </div>


                      {/* DAY */}

                      <div className="bg-slate-50 rounded-xl p-4">

                        <div className="flex items-center gap-2 text-slate-400 text-xs">

                          <FaCalendarCheck />

                          Day

                        </div>

                        <p className="text-sm font-semibold text-slate-800 mt-1">

                          {appointment.day ||
                            appointment.slot?.day ||
                            "N/A"}

                        </p>

                      </div>


                      {/* FEE */}

                      <div className="bg-slate-50 rounded-xl p-4">

                        <div className="flex items-center gap-2 text-slate-400 text-xs">

                          <FaUser />

                          Appointment Fee

                        </div>

                        <p className="text-sm font-semibold text-slate-800 mt-1">

                          {appointment.fee !== undefined
                            ? `₹${appointment.fee}`
                            : "N/A"}

                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>

  );

};

export default TodayAllAppointments;