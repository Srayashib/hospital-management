import ReportUpload from "../../components/doctor/ReportUpload";
import ReportsTable from "../../components/doctor/ReportsTable";

import "../../assets/css/doctorDashboard.css";

const Reports = () => {
  return (
    <div className="doctor-page-wrapper">

      <h2 className="doctor-page-title">
        Medical Reports
      </h2>

      <ReportUpload />

      <ReportsTable />

    </div>
  );
};

export default Reports;