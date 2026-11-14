import { Outlet } from "react-router-dom";
import ReceptionistSidebar from "../components/receptionist/ReceptionistSidebar";

import "../assets/css/receptionistDashboard.css";

const ReceptionistLayout = () => {
  return (
    <div className="receptionist-layout">

      <ReceptionistSidebar />

      <main className="receptionist-main">
        <Outlet />
      </main>

    </div>
  );
};

export default ReceptionistLayout;