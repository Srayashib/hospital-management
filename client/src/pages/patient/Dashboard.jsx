import PatientWelcome from "../../components/patient/PatientWelcome";
import PatientStats from "../../components/patient/PatientStats";
import PatientNextAppointment from "../../components/patient/PatientNextAppointment";
import PatientQuickActions from "../../components/patient/PatientQuickActions";
import PatientRecentAppointments from "../../components/patient/PatientRecentAppointments";
import PatientHealthSummary from "../../components/patient/PatientHealthSummary";
import PatientPrescriptions from "../../components/patient/PatientPrescriptions";
import PatientNotifications from "../../components/patient/PatientNotifications";

const PatientDashboard = () => {

  return (
    <div className="patient-dashboard-page">

      <div className="patient-dashboard-container">

        {/* WELCOME */}

        <PatientWelcome />


        {/* STATS */}

        <PatientStats />


        {/* MAIN GRID */}

        <div className="patient-dashboard-grid">

          {/* MAIN COLUMN */}

          <div className="patient-dashboard-main">

            <PatientNextAppointment />

            <PatientRecentAppointments />

            <PatientPrescriptions />

          </div>


          {/* SIDE COLUMN */}

          <div className="patient-dashboard-side">

            <PatientQuickActions />

            <PatientHealthSummary />

          

          </div>

        </div>

      </div>

    </div>
  );
};

export default PatientDashboard;