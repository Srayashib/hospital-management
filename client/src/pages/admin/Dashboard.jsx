
import { useEffect, useState } from "react";

import DashboardHeader from "../../components/admin/DashboardHeader";
import StatCard from "../../components/admin/StatCard";
import RevenueChart from "../../components/admin/RevenueChart";
import AppointmentChart from "../../components/admin/AppointmentChart";
import RecentAppointments from "../../components/admin/RecentAppointments";
import RecentPatients from "../../components/admin/RecentPatients";
import QuickActions from "../../components/admin/QuickActions";
import ActivityTimeline from "../../components/admin/ActivityTimeline";
import CalendarWidget from "../../components/admin/CalendarWidget";

import { getAdminDashboardStats } from "../../services/adminService";

import {
  FaUserMd,
  FaUsers,
  FaCalendarAlt,
  FaMoneyBillWave,
} from "react-icons/fa";

const Dashboard = () => {
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
    revenue: 0,
    monthlyRevenue: [],
  appointmentStatus: [],
  });

  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        setStatsLoading(true);
        setStatsError("");

        const response = await getAdminDashboardStats();

        if (response?.success) {
          setStats({
  doctors: response.stats?.doctors ?? 0,
  patients: response.stats?.patients ?? 0,
  appointments: response.stats?.appointments ?? 0,
  revenue: response.stats?.revenue ?? 0,
  monthlyRevenue: response.stats?.monthlyRevenue ?? [],
  appointmentStatus: response.stats?.appointmentStatus ?? [],
});
        } else {
          setStatsError("Failed to load dashboard statistics.");
        }
      } catch (error) {
        console.error("Dashboard statistics error:", error);

        setStatsError(
          error?.response?.data?.message ||
            "Failed to load dashboard statistics."
        );
      } finally {
        setStatsLoading(false);
      }
    };

    loadDashboardStats();
  }, []);

  const formatRevenue = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  return (
    <>
      <DashboardHeader />

      {statsError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {statsError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Doctors"
          value={statsLoading ? "..." : stats.doctors}
          growth="Total registered"
          color="bg-sky-500"
          icon={<FaUserMd />}
        />

        <StatCard
          title="Patients"
          value={statsLoading ? "..." : stats.patients}
          growth="Total registered"
          color="bg-green-500"
          icon={<FaUsers />}
        />

        <StatCard
          title="Appointments"
          value={statsLoading ? "..." : stats.appointments}
          growth="All appointments"
          color="bg-orange-500"
          icon={<FaCalendarAlt />}
        />

        <StatCard
          title="Revenue"
          value={
            statsLoading ? "..." : formatRevenue(stats.revenue)
          }
          growth="Completed & paid"
          color="bg-purple-500"
          icon={<FaMoneyBillWave />}
        />
      </div>



      
<div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
  <div className="xl:col-span-2">
    <RevenueChart data={stats.monthlyRevenue} />
  </div>

  <AppointmentChart data={stats.appointmentStatus} />
</div>


      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-3">
          <RecentAppointments />
        </div>

       
      </div>

    
    </>
  );
};

export default Dashboard;