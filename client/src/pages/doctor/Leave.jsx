import { useState } from "react";

import LeaveCalendar from "../../components/doctor/LeaveCalendar";
import LeaveRequestForm from "../../components/doctor/LeaveRequestForm";

import "../../assets/css/doctorLeave.css";

const Leave = () => {

  const [showForm, setShowForm] = useState(false);

  return (
    <div className="doctor-leave-page">

      {/* =========================================
          PAGE HEADER
      ========================================= */}

      <div className="doctor-leave-page-header">

        <div>
          <h2>Leave Management</h2>

          <p>
            Manage your leave applications and request new leave.
          </p>
        </div>

        <button
          type="button"
          className="doctor-leave-request-btn"
          onClick={() => setShowForm(true)}
        >
          <span>+</span>
          Request Leave
        </button>

      </div>


      {/* =========================================
          LEAVE HISTORY
      ========================================= */}

      <LeaveCalendar />


      {/* =========================================
          LEAVE REQUEST FORM
      ========================================= */}

      {showForm && (
        <LeaveRequestForm
          onClose={() => setShowForm(false)}
        />
      )}

    </div>
  );
};

export default Leave;