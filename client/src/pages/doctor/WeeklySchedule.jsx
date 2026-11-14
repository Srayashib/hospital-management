import ScheduleCalendar from "../../components/doctor/ScheduleCalendar";
import "../../assets/css/doctorDashboard.css";

const WeeklySchedule = () => {
  return (
    <div className="doctor-page-wrapper">

      <h2 className="doctor-page-title">
        Weekly Schedule
      </h2>

      <ScheduleCalendar />

    </div>
  );
};

export default WeeklySchedule;