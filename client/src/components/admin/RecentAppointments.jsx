
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAdminRecentAppointments } from "../../services/adminService";

const statusColor = (status) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-600";
    case "Pending":
      return "bg-yellow-100 text-yellow-600";
    case "Cancelled":
      return "bg-red-100 text-red-600";
    case "Confirmed":
      return "bg-sky-100 text-sky-600";
    case "Checked In":
      return "bg-purple-100 text-purple-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const RecentAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAdminRecentAppointments();

        if (response?.success) {
          setAppointments(response.appointments || []);
        } else {
          setAppointments([]);
          setError("Unable to load appointments.");
        }
      } catch (err) {
        console.error("Failed to load recent appointments:", err);

        setError(
          err?.response?.data?.message ||
            "Failed to load recent appointments."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  // Group appointments by department
  const groupedAppointments = appointments.reduce(
    (groups, appointment) => {
      const department = appointment.department || "Unassigned";

      if (!groups[department]) {
        groups[department] = [];
      }

      groups[department].push(appointment);

      return groups;
    },
    {}
  );

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Recent Appointments
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Appointments grouped by department
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/appointments")}
          className="text-sky-600 hover:text-sky-700 font-medium"
        >
          View All
        </button>
      </div>

      {loading && (
        <div className="py-8 text-center text-slate-500">
          Loading recent appointments...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && appointments.length === 0 && (
        <div className="py-8 text-center text-slate-500">
          No recent appointments found.
        </div>
      )}

      {!loading &&
        !error &&
        Object.entries(groupedAppointments).map(
          ([department, departmentAppointments]) => (
            <div key={department} className="mb-7 last:mb-0">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h3 className="text-base font-bold text-slate-800">
                  {department}
                </h3>

                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                  {departmentAppointments.length}{" "}
                  {departmentAppointments.length === 1
                    ? "appointment"
                    : "appointments"}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-left">
                      <th className="py-3 pr-4 text-sm text-slate-500 font-semibold">
                        Patient
                      </th>
                      <th className="py-3 pr-4 text-sm text-slate-500 font-semibold">
                        Doctor
                      </th>
                      <th className="py-3 pr-4 text-sm text-slate-500 font-semibold">
                        Date
                      </th>
                      <th className="py-3 text-sm text-slate-500 font-semibold">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {departmentAppointments.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-slate-100 hover:bg-slate-50 transition"
                      >
                        <td className="py-4 pr-4 font-medium text-slate-700">
                          {item.patient}
                        </td>

                        <td className="py-4 pr-4 text-sm text-slate-600">
                          {item.doctor}
                        </td>

                        <td className="py-4 pr-4 text-sm text-slate-600">
                          {formatDate(item.date)}
                        </td>

                        <td className="py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${statusColor(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}
    </div>
  );
};

export default RecentAppointments;
