import { useEffect, useState } from "react";
import { FiClock, FiMapPin } from "react-icons/fi";

import {
  getMyAppointments,
} from "../../services/patientProfileService";

const PatientNextAppointment = () => {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD NEXT APPOINTMENT
  // =====================================================

  useEffect(() => {
    const loadNextAppointment = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyAppointments();

        const appointments =
          response?.appointments || [];

        const now = new Date();

        // =================================================
        // FILTER UPCOMING APPOINTMENTS
        // =================================================

        const upcomingAppointments =
          appointments.filter((item) => {
            if (
              item.status === "Completed" ||
              item.status === "Cancelled"
            ) {
              return false;
            }

            if (!item.date || !item.startTime) {
              return false;
            }

            const appointmentDateTime =
              createAppointmentDateTime(
                item.date,
                item.startTime
              );

            return appointmentDateTime > now;
          });

        // =================================================
        // SORT NEAREST FIRST
        // =================================================

        upcomingAppointments.sort((a, b) => {
          const dateA = createAppointmentDateTime(
            a.date,
            a.startTime
          );

          const dateB = createAppointmentDateTime(
            b.date,
            b.startTime
          );

          return dateA - dateB;
        });

        // =================================================
        // SET NEXT APPOINTMENT
        // =================================================

        setAppointment(
          upcomingAppointments.length > 0
            ? upcomingAppointments[0]
            : null
        );
      } catch (err) {
        console.error(
          "Failed to load next appointment:",
          err
        );

        setError(
          err?.response?.data?.message ||
            "Failed to load appointment."
        );

        setAppointment(null);
      } finally {
        setLoading(false);
      }
    };

    loadNextAppointment();
  }, []);

  // =====================================================
  // CREATE APPOINTMENT DATE + TIME
  // =====================================================

  const createAppointmentDateTime = (
    date,
    time
  ) => {
    const appointmentDate = new Date(date);

    if (Number.isNaN(appointmentDate.getTime())) {
      return new Date(NaN);
    }

    const [hours, minutes] = String(time)
      .split(":")
      .map(Number);

    appointmentDate.setHours(
      hours || 0,
      minutes || 0,
      0,
      0
    );

    return appointmentDate;
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatAppointmentDate = (
    date,
    startTime
  ) => {
    const appointmentDateTime =
      createAppointmentDateTime(
        date,
        startTime
      );

    if (
      Number.isNaN(
        appointmentDateTime.getTime()
      )
    ) {
      return "-";
    }

    const now = new Date();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointmentDay = new Date(
      appointmentDateTime
    );
    appointmentDay.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(
      tomorrow.getDate() + 1
    );

    let dayLabel;

    if (
      appointmentDay.getTime() ===
      today.getTime()
    ) {
      dayLabel = "Today";
    } else if (
      appointmentDay.getTime() ===
      tomorrow.getTime()
    ) {
      dayLabel = "Tomorrow";
    } else {
      dayLabel =
        appointmentDateTime.toLocaleDateString(
          "en-US",
          {
            weekday: "short",
            month: "short",
            day: "numeric",
          }
        );
    }

    const timeLabel =
      appointmentDateTime.toLocaleTimeString(
        "en-US",
        {
          hour: "numeric",
          minute: "2-digit",
        }
      );

    return `${dayLabel} · ${timeLabel}`;
  };

  // =====================================================
  // CALCULATE DURATION
  // =====================================================

  const getDuration = (
    startTime,
    endTime
  ) => {
    if (!startTime || !endTime) {
      return "Duration not specified";
    }

    const [startHours, startMinutes] =
      String(startTime)
        .split(":")
        .map(Number);

    const [endHours, endMinutes] =
      String(endTime)
        .split(":")
        .map(Number);

    const startTotal =
      startHours * 60 + startMinutes;

    let endTotal =
      endHours * 60 + endMinutes;

    // Handles appointments crossing midnight
    if (endTotal < startTotal) {
      endTotal += 24 * 60;
    }

    const duration =
      endTotal - startTotal;

    if (duration <= 0) {
      return "Duration not specified";
    }

    if (duration < 60) {
      return `${duration} Minutes`;
    }

    const hours = Math.floor(
      duration / 60
    );

    const minutes = duration % 60;

    if (minutes === 0) {
      return `${hours} ${
        hours === 1 ? "Hour" : "Hours"
      }`;
    }

    return `${hours}h ${minutes}m`;
  };

  // =====================================================
  // DOCTOR INITIALS
  // =====================================================

  const getDoctorInitials = (name) => {
    if (!name) {
      return "DR";
    }

    const parts = name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (parts.length === 1) {
      return parts[0]
        .substring(0, 2)
        .toUpperCase();
    }

    return (
      parts[0][0] +
      parts[parts.length - 1][0]
    ).toUpperCase();
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        <div className="p-5 sm:p-6 border-b border-slate-100">

          <h3 className="font-bold text-slate-900 text-lg">
            Next Appointment
          </h3>

          <p className="text-sm text-slate-400 mt-1">
            Your upcoming consultation
          </p>

        </div>

        <div className="p-5 sm:p-6">

          <div className="rounded-2xl bg-slate-100 animate-pulse h-48" />

        </div>

      </section>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <section className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        <div className="p-5 sm:p-6 border-b border-slate-100">

          <h3 className="font-bold text-slate-900 text-lg">
            Next Appointment
          </h3>

          <p className="text-sm text-slate-400 mt-1">
            Your upcoming consultation
          </p>

        </div>

        <div className="p-5 sm:p-6">

          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">

            <p className="text-sm text-red-600">
              {error}
            </p>

          </div>

        </div>

      </section>
    );
  }

  // =====================================================
  // NO UPCOMING APPOINTMENT
  // =====================================================

  if (!appointment) {
    return (
      <section className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">

          <div>

            <h3 className="font-bold text-slate-900 text-lg">
              Next Appointment
            </h3>

            <p className="text-sm text-slate-400 mt-1">
              Your upcoming consultation
            </p>

          </div>

        </div>

        <div className="p-5 sm:p-6">

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">

            <div className="mx-auto w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
              <FiClock className="text-2xl" />
            </div>

            <h4 className="mt-4 text-lg font-bold text-slate-900">
              No upcoming appointments
            </h4>

            <p className="mt-2 text-sm text-slate-500">
              You currently have no upcoming
              consultations.
            </p>

          </div>

        </div>

      </section>
    );
  }

  // =====================================================
  // APPOINTMENT DATA
  // =====================================================

  const doctorName =
    appointment.doctor?.name ||
    "Doctor";

  const department =
    appointment.doctor?.department ||
    appointment.doctor?.qualification ||
    "Medical Consultation";

  const location =
    appointment.location ||
    appointment.room ||
    "Location not specified";

  return (
    <section className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

      <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">

        <div>

          <h3 className="font-bold text-slate-900 text-lg">
            Next Appointment
          </h3>

          <p className="text-sm text-slate-400 mt-1">
            Your upcoming consultation
          </p>

        </div>

        <button className="text-sm font-semibold text-sky-600 hover:text-sky-700">
          View All
        </button>

      </div>


      <div className="p-5 sm:p-6">

        <div className="rounded-2xl bg-gradient-to-br from-sky-600 to-cyan-600 p-5 sm:p-6 text-white">

          <div className="flex flex-col sm:flex-row sm:items-center gap-5">

            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-xl font-bold shrink-0">
              {getDoctorInitials(
                doctorName
              )}
            </div>


            <div className="flex-1">

              <p className="text-sky-100 text-sm">
                {formatAppointmentDate(
                  appointment.date,
                  appointment.startTime
                )}
              </p>

              <h4 className="text-xl font-bold mt-1">
                {doctorName}
              </h4>

              <p className="text-sky-100 text-sm mt-1">
                {department}
              </p>

            </div>


            <button className="px-4 py-2.5 bg-white text-sky-700 rounded-xl font-semibold text-sm hover:bg-sky-50">
              View Details
            </button>

          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">

            <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">

              <FiClock />

              <div>

                <p className="text-xs text-sky-100">
                  Duration
                </p>

                <p className="text-sm font-semibold">
                  {getDuration(
                    appointment.startTime,
                    appointment.endTime
                  )}
                </p>

              </div>

            </div>


            <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">

              <FiMapPin />

              <div>

                <p className="text-xs text-sky-100">
                  Location
                </p>

                <p className="text-sm font-semibold">
                  {location}
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default PatientNextAppointment;