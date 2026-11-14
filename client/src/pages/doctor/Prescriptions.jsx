import PrescriptionForm from "../../components/doctor/PrescriptionForm";
import PrescriptionHistory from "../../components/doctor/PrescriptionHistory";

import "../../assets/css/doctorDashboard.css";

const Prescriptions = () => {
  return (
    <div className="doctor-page-wrapper">

      <h2 className="doctor-page-title">
        Prescriptions
      </h2>

      <PrescriptionForm />

      <PrescriptionHistory />

    </div>
  );
};

export default Prescriptions;