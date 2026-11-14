import { useEffect, useState } from "react";
import { FiChevronRight, FiCalendar } from "react-icons/fi";

import {
  getMyAppointments,
} from "../../services/patientProfileService";

const PatientRecentAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyAppointments();

        const allAppointments =
          response?.appointments || [];

        // =================================================
        // SORT LATEST FIRST
        // =================================================

        const sortedAppointments =
          [...allAppointments].sort((a, b) => {
            const dateA = createAppointmentDateTime(
              a.date,
              a.startTime
            );

            const dateB = createAppointmentDateTime(
              b.date,
              b.startTime
            );

            return dateB - dateA;
          });

        // =================================================
        // SHOW ONLY 3 MOST RECENT
        // =================================================

        setAppointments(
          sortedAppointments.slice(0, 3)
        );
      } catch (err) {
        console.error(
          "Failed to load recent appointments:",
          err
        );

        setError(
          err?.response?.data?.message ||
            "Failed to load appointments."
        );

        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  // =====================================================
  // CREATE DATE + TIME
  // =====================================================

  const createAppointmentDateTime = (
    date,
    time
  ) => {
    const appointmentDate = new Date(date);

    if (
      Number.isNaN(
        appointmentDate.getTime()
      )
    ) {
      return new Date(0);
    }

    if (time) {
      const [hours, minutes] = String(time)
        .split(":")
        .map(Number);

      appointmentDate.setHours(
        hours || 0,
        minutes || 0,
        0,
        0
      );
    }

    return appointmentDate;
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "-";
    }

    return parsedDate.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }
    );
  };

  return (
    <section className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">

        <div>

          <h3 className="font-bold text-slate-900 text-lg">
            Recent Appointments
          </h3>

          <p className="text-sm text-slate-400 mt-1">
            Your latest consultations
          </p>

        </div>

        <button className="text-sky-600 hover:text-sky-700">
          <FiChevronRight />
        </button>

      </div>


      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div className="p-6 space-y-4">

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="animate-pulse flex items-center gap-4"
            >

              <div className="w-11 h-11 rounded-xl bg-slate-200" />

              <div className="flex-1 space-y-2">

                <div className="h-4 bg-slate-200 rounded w-32" />

                <div className="h-3 bg-slate-200 rounded w-24" />

              </div>

              <div className="h-3 bg-slate-200 rounded w-20" />

              <div className="h-7 bg-slate-200 rounded-full w-20" />

            </div>
          ))}

        </div>
      )}


      {/* =================================================
          ERROR
      ================================================= */}

      {!loading && error && (
        <div className="p-6">

          <div className="rounded-xl border border-red-200 bg-red-50 p-4">

            <p className="text-sm text-red-600">
              {error}
            </p>

          </div>

        </div>
      )}


      {/* =================================================
          NO APPOINTMENTS
      ================================================= */}

      {!loading &&
        !error &&
        appointments.length === 0 && (
          <div className="p-8 text-center">

            <div className="mx-auto w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">

              <FiCalendar className="text-2xl" />

            </div>

            <h4 className="mt-4 text-lg font-bold text-slate-900">
              No appointments yet
            </h4>

            <p className="mt-2 text-sm text-slate-500">
              Your recent consultations will appear here.
            </p>

          </div>
        )}


      {/* =================================================
          APPOINTMENT LIST
      ================================================= */}

      {!loading &&
        !error &&
        appointments.length > 0 && (
          <div className="divide-y divide-slate-100">

            {appointments.map((appointment) => (
              <AppointmentRow
                key={appointment._id}
                doctor={
                  appointment.doctor?.name ||
                  "Doctor"
                }
                department={
                  appointment.doctor?.department ||
                  appointment.doctor?.qualification ||
                  "Medical Consultation"
                }
                date={formatDate(
                  appointment.date
                )}
                status={
                  appointment.status ||
                  "Pending"
                }
              />
            ))}

          </div>
        )}

    </section>
  );
};


// =====================================================
// APPOINTMENT ROW
// =====================================================

const AppointmentRow = ({
  doctor,
  department,
  date,
  status,
}) => {

  // =====================================================
  // DOCTOR INITIALS
  // =====================================================

  const getDoctorInitials = (name) => {
    if (!name) {
      return "DR";
    }

    const parts = name
      .replace(/^Dr\.\s*/i, "")
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
  // STATUS STYLING
  // =====================================================

  const getStatusClass = () => {
    switch (status) {
      case "Completed":
        return "bg-emerald-50 text-emerald-600";

      case "Cancelled":
        return "bg-red-50 text-red-500";

      case "Confirmed":
        return "bg-sky-50 text-sky-600";

      case "Checked In":
        return "bg-violet-50 text-violet-600";

      case "Pending":
      default:
        return "bg-amber-50 text-amber-600";
    }
  };

  return (
    <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">

      {/* DOCTOR ICON */}

      <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold shrink-0">
        {getDoctorInitials(doctor)}
      </div>


      {/* DOCTOR */}

      <div className="flex-1">

        <h4 className="font-semibold text-slate-800">
          {doctor}
        </h4>

        <p className="text-sm text-slate-400 mt-1">
          {department}
        </p>

      </div>


      {/* DATE */}

      <p className="text-sm text-slate-500">
        {date}
      </p>


      {/* STATUS */}

      <span
        className={`
          text-xs font-semibold px-3 py-1.5 rounded-full
          ${getStatusClass()}
        `}
      >
        {status}
      </span>

    </div>
  );
};

export default PatientRecentAppointments;