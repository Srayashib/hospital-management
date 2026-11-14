import { Outlet } from "react-router-dom";
import PatientSidebar from "../components/patient/PatientSidebar";
import PatientTopbar from "../components/patient/PatientTopbar";

import "../assets/css/patientDashboard.css";

const PatientLayout = () => {

  return (

    <div className="patient-layout">

      <PatientSidebar />

      <main className="patient-main">

        <PatientTopbar />

        <Outlet />

      </main>

    </div>

  );
};

export default PatientLayout;