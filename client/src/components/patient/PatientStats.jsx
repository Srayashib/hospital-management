import { useEffect, useState } from "react";

import {
  FiCalendar,
  FiActivity,
  FiFileText,
  FiClipboard,
} from "react-icons/fi";

import {
  getPatientDashboardStats,
} from "../../services/patientProfileService";

const PatientStats = () => {
  const [stats, setStats] = useState({
    upcoming: 0,
    completed: 0,
    records: 0,
    prescriptions: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response =
          await getPatientDashboardStats();

        if (response?.success) {
  setStats({
    upcoming:
      response.stats?.upcoming || 0,

    completed:
      response.stats?.completed || 0,

    records:
      response.stats?.records || 0,

    prescriptions:
      response.stats?.prescriptions || 0,
  });
}
      } catch (error) {
        console.error(
          "Failed to load patient dashboard stats:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

      <StatCard
        icon={<FiCalendar />}
        title="Upcoming"
        value={loading ? "—" : stats.upcoming}
        subtitle="Appointments"
        iconBg="bg-sky-100"
        iconColor="text-sky-600"
      />

      <StatCard
        icon={<FiActivity />}
        title="Completed"
        value={loading ? "—" : stats.completed}
        subtitle="Appointments"
        iconBg="bg-emerald-100"
        iconColor="text-emerald-600"
      />

      <StatCard
        icon={<FiFileText />}
        title="Records"
        value={loading ? "—" : stats.records}
        subtitle="Medical records"
        iconBg="bg-violet-100"
        iconColor="text-violet-600"
      />

      <StatCard
        icon={<FiClipboard />}
        title="Prescriptions"
        value={
          loading
            ? "—"
            : stats.prescriptions
        }
        subtitle="Active prescriptions"
        iconBg="bg-amber-100"
        iconColor="text-amber-600"
      />

    </section>
  );
};


const StatCard = ({
  icon,
  title,
  value,
  subtitle,
  iconBg,
  iconColor,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs sm:text-sm text-slate-400">
            {title}
          </p>

          <h3 className="text-2xl font-bold text-slate-900 mt-1">
            {value}
          </h3>

          <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
            {subtitle}
          </p>

        </div>

        <div
          className={`
            w-10 h-10 rounded-xl
            ${iconBg}
            ${iconColor}
            flex items-center justify-center
          `}
        >
          {icon}
        </div>

      </div>

    </div>
  );
};

export default PatientStats;