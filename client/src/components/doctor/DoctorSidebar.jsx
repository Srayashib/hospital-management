import { NavLink } from "react-router-dom";

import {
  FaTachometerAlt,
  FaCalendarCheck,
  FaClock,
  FaUsers,
  FaCalendarAlt,
  FaRegClock,
  FaBan,
  FaUserMd,
  FaSignOutAlt,
} from "react-icons/fa";

const DoctorSidebar = () => {

  // Reusable active/inactive class
  const doctorNavClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
      isActive
        ? "bg-white text-sky-700 font-semibold shadow-sm"
        : "text-white hover:bg-sky-600"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <aside className="w-72 min-h-screen bg-sky-700 text-white flex flex-col shadow-xl">

      {/* Logo */}

      <div className="px-6 py-6 border-b border-sky-600">

        <h1 className="text-2xl font-bold flex items-center gap-2">
          🏥 <span>Doctor Panel</span>
        </h1>

      </div>


      {/* Menu */}

      <nav className="flex-1 px-4 py-6 overflow-y-auto">

        {/* MAIN */}

        <p className="text-xs uppercase text-sky-200 mb-3 tracking-wider">
          Main
        </p>

        <NavLink
          to="/doctor/dashboard"
          className={doctorNavClass}
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>


        {/* APPOINTMENTS */}

        <p className="text-xs uppercase text-sky-200 mt-6 mb-3 tracking-wider">
          Appointments
        </p>

        <NavLink
           to="/doctor/today-appointments"
          className={doctorNavClass}
        >
          <FaCalendarCheck />
          <span>Today's All Appointments</span>
        </NavLink>

        <NavLink
          to="/doctor/appointments"
          className={doctorNavClass}
        >
          <FaClock />
          <span>Upcoming</span>
        </NavLink>


        {/* PATIENTS */}

        <p className="text-xs uppercase text-sky-200 mt-6 mb-3 tracking-wider">
          Patients
        </p>

        <NavLink
          to="/doctor/patients"
          className={doctorNavClass}
        >
          <FaUsers />
          <span>Patients</span>
        </NavLink>


        {/* SCHEDULE */}

        <p className="text-xs uppercase text-sky-200 mt-6 mb-3 tracking-wider">
          Schedule
        </p>

        <NavLink
          to="/doctor/weekly-schedule"
          className={doctorNavClass}
        >
          <FaCalendarAlt />
          <span>Weekly Schedule</span>
        </NavLink>

        <NavLink
          to="/doctor/available-slots"
          className={doctorNavClass}
        >
          <FaRegClock />
          <span>Available Slots</span>
        </NavLink>

        <NavLink
          to="/doctor/leave"
          className={doctorNavClass}
        >
          <FaBan />
          <span>Leave</span>
        </NavLink>


        {/* MEDICAL */}

       


        {/* ACCOUNT */}

        <p className="text-xs uppercase text-sky-200 mt-6 mb-3 tracking-wider">
          Account
        </p>

        <NavLink
          to="/doctor/profile"
          className={doctorNavClass}
        >
          <FaUserMd />
          <span>Profile</span>
        </NavLink>

      </nav>


      {/* LOGOUT */}

      <div className="p-4 border-t border-sky-600">

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 py-3 rounded-lg font-semibold transition"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
};

export default DoctorSidebar;