import ReceptionistHeader from "../../components/receptionist/ReceptionistHeader";
import ReceptionistWelcome from "../../components/receptionist/ReceptionistWelcome";
import ReceptionistStats from "../../components/receptionist/ReceptionistStats";
import ReceptionistQuickActions from "../../components/receptionist/ReceptionistQuickActions";
import ReceptionistAppointmentChart from "../../components/receptionist/ReceptionistAppointmentChart";
import ReceptionistTodayAppointments from "../../components/receptionist/ReceptionistTodayAppointments";
import ReceptionistRecentPatients from "../../components/receptionist/ReceptionistRecentPatients";
import ReceptionistPaymentCard from "../../components/receptionist/ReceptionistPaymentCard";

import "../../assets/css/receptionistDashboard.css";

const ReceptionistDashboard = () => {

  return (
    <div className="receptionist-dashboard-page">

      <ReceptionistHeader />

      <div className="receptionist-dashboard-container">

        <ReceptionistWelcome />

        <ReceptionistStats />

        <ReceptionistQuickActions />


        <div className="receptionist-dashboard-grid">

          <div className="receptionist-dashboard-main">

            <ReceptionistAppointmentChart />

            {/* <ReceptionistTodayAppointments />

            <ReceptionistRecentPatients /> */}

          </div>


          <div className="receptionist-dashboard-side">

            <ReceptionistPaymentCard />

          </div>

        </div>

      </div>

    </div>
  );
};

export default ReceptionistDashboard;