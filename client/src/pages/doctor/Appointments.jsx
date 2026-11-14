import TodayAppointments from "../../components/doctor/TodayAppointments";

import "../../assets/css/doctorDashboard.css";

const Appointments = () => {
  return (
    <div className="doctor-page-wrapper">

      <h2 className="doctor-page-title">
        Appointments
      </h2>

      <TodayAppointments />

    </div>
  );
};

export default Appointments;