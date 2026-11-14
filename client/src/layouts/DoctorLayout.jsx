import { Outlet } from "react-router-dom";
import DoctorSidebar from "../components/doctor/DoctorSidebar";


const DoctorLayout = () => {
  return (
    <div className="doctor-layout">

      <DoctorSidebar />

      <main className="doctor-main">
        <Outlet />
      </main>

    </div>
  );
};

export default DoctorLayout;