import DoctorPatients from "../../components/doctor/DoctorPatients";

import "../../assets/css/doctorDashboard.css";

const Patients = () => {
  return (
    <div className="doctor-page-wrapper">

      <h2 className="doctor-page-title">
        Patients
      </h2>

      <DoctorPatients />

    </div>
  );
};

export default Patients;