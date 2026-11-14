import { NavLink } from "react-router-dom";

import {
  FaHospital,
  FaTachometerAlt,
  FaUserPlus,
  FaCalendarCheck,
  FaCalendarTimes,
  FaUserMd,
  FaMoneyBillWave,
  FaUsers,
  FaUserCheck,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";

const ReceptionistSidebar = () => {

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <aside className="receptionist-sidebar">

      {/* Logo */}

      <div className="receptionist-sidebar-brand">

        <div className="receptionist-brand-icon">
          <FaHospital />
        </div>

        <div>
          <h2>Medicare</h2>
          <span>Receptionist</span>
        </div>

      </div>


      {/* Navigation */}

      <nav className="receptionist-sidebar-nav">

        <p className="receptionist-nav-title">
          MAIN MENU
        </p>

        <NavLink
          to="/receptionist/dashboard"
          className={({ isActive }) =>
            isActive
              ? "receptionist-nav-link active"
              : "receptionist-nav-link"
          }
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>


        {/* =====================================================
    PATIENTS
===================================================== */}

        <p className="receptionist-nav-title">
          PATIENTS
        </p>

       


        {/* Patients */}
        <NavLink
          to="/receptionist/patients"
          end
          className={({ isActive }) =>
            isActive
              ? "receptionist-nav-link active"
              : "receptionist-nav-link"
          }
        >
          <FaUsers />
          <span>Patients</span>
        </NavLink>


        {/* Patient Check-In */}
        <NavLink
          to="/receptionist/patients/check-in"
          end
          className={({ isActive }) =>
            isActive
              ? "receptionist-nav-link active"
              : "receptionist-nav-link"
          }
        >
          <FaUserCheck />
          <span>Patient Check-In</span>
        </NavLink>


        <p className="receptionist-nav-title">
          APPOINTMENTS
        </p>

    
          {/* Book Appointment */}
          <NavLink
            to="/receptionist/appointments/book"
            className={({ isActive }) =>
              isActive
                ? "receptionist-nav-link active"
                : "receptionist-nav-link"
            }
          >
            <FaCalendarCheck />
            <span>Book Appointment</span>
          </NavLink>


          {/* Appointments */}
          <NavLink
            to="/receptionist/appointments"
            end
            className={({ isActive }) =>
              isActive
                ? "receptionist-nav-link active"
                : "receptionist-nav-link"
            }
          >
            <FaCalendarCheck />
            <span>Appointments</span>
          </NavLink>


          {/* Cancel Appointment */}
          <NavLink
            to="/receptionist/appointments/cancel"
            className={({ isActive }) =>
              isActive
                ? "receptionist-nav-link active"
                : "receptionist-nav-link"
            }
          >
            <FaCalendarTimes />
            <span>Cancel Appointment</span>
          </NavLink>


        <p className="receptionist-nav-title">
          OTHER
        </p>

        <NavLink
          to="/receptionist/doctors"
          className="receptionist-nav-link"
        >
          <FaUserMd />
          <span>Doctor Availability</span>
        </NavLink>

        <NavLink
          to="/receptionist/payments"
          className="receptionist-nav-link"
        >
          <FaMoneyBillWave />
          <span>Payments</span>
        </NavLink>

        <NavLink
          to="/receptionist/profile"
          className={({ isActive }) =>
            isActive
              ? "receptionist-nav-link active"
              : "receptionist-nav-link"
          }
        >
          <FaUserCircle />
          <span>My Profile</span>
        </NavLink>

      </nav>


      {/* Logout */}

      <div className="receptionist-sidebar-bottom">

        <button
          type="button"
          className="receptionist-logout-btn"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
};

export default ReceptionistSidebar;