import DoctorHeader from "../../components/doctor/DoctorHeader";
import WelcomeBanner from "../../components/doctor/WelcomeBanner";
import DashboardCards from "../../components/doctor/DashboardCards";
import QuickActions from "../../components/doctor/QuickActions";
import TodayAppointments from "../../components/doctor/TodayAppointments";
import RecentPatients from "../../components/doctor/RecentPatients";
import DoctorProfileCard from "../../components/doctor/DoctorProfileCard";

import "../../assets/css/doctorDashboard.css";

const Dashboard = () => {
  return (
    <div className="doctor-dashboard-page">

      <DoctorHeader />

      <WelcomeBanner />

      <DashboardCards />

      <QuickActions />

      <div className="doctor-dashboard-content">

        <div className="doctor-dashboard-left">

          <TodayAppointments />

          <RecentPatients />

        </div>

        <div className="doctor-dashboard-right">

          <DoctorProfileCard />

        </div>

      </div>

    </div>
  );
};

export default Dashboard;