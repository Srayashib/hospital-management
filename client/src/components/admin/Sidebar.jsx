import { NavLink, useNavigate } from "react-router-dom";
import {
  FaChartPie,
  FaUserMd,
  FaHospital,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaCog,
  FaSignOutAlt,
  FaUserInjured,
  FaUserNurse,
  FaChevronDown,
} from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuClass = ({ isActive }) =>
    `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition duration-300 ${
      isActive
        ? "bg-sky-500 text-white"
        : "hover:bg-slate-800 text-slate-200"
    }`;

  return (
    <aside className="w-72 h-screen bg-slate-900 text-white flex flex-col shadow-xl">

      {/* Logo */}

      <div className="h-20 flex items-center justify-center border-b border-slate-800">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-xl bg-sky-500 flex items-center justify-center text-2xl">
            🏥
          </div>

          <div>
            <h2 className="text-xl font-bold">Hospital</h2>
            <p className="text-xs text-slate-400">
              Admin Panel
            </p>
          </div>

        </div>

      </div>

      {/* Navigation */}

      <div className="flex-1 overflow-y-auto py-5">

        <ul className="space-y-2 px-4">

          {/* Dashboard */}

          <li>
            <NavLink
              to="/admin/dashboard"
              className={menuClass}
            >
              <FaChartPie />
              Dashboard
            </NavLink>
          </li>

          {/* Doctors */}

          {/* Doctors */}

            <li>

              <div className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-800 transition">

                <div className="flex items-center gap-3">

                  <FaUserMd />

                  <span>Doctors</span>

                </div>

                <FaChevronDown size={12} />

              </div>


              <div className="ml-8 mt-2 space-y-2">

                {/* All Doctors */}

                <NavLink
                  to="/admin/doctors"
                  className={({ isActive }) =>
                    isActive
                      ? "block text-sky-400"
                      : "block text-slate-300 hover:text-sky-400"
                  }
                >
                  All Doctors
                </NavLink>


                {/* Leave */}

                <NavLink
                  to="/admin/leaves"
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center gap-2 text-sky-400"
                      : "flex items-center gap-2 text-slate-300 hover:text-sky-400"
                  }
                >
                  

                  <span>Leave</span>
                </NavLink>

              </div>

            </li>

          {/* Departments */}

          <li>

            <div className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-800 transition">

              <div className="flex items-center gap-3">

                <FaHospital />

                <span>Departments</span>

              </div>

              <FaChevronDown size={12} />

            </div>

            <div className="ml-8 mt-2">

              <NavLink
                to="/admin/departments"
                className={({ isActive }) =>
                  isActive
                    ? "block text-sky-400"
                    : "block text-slate-300 hover:text-sky-400"
                }
              >
                All Departments
              </NavLink>

            </div>

          </li>

          {/* Patients */}

          <li>

            <NavLink
              to="/admin/patients"
              className={menuClass}
            >
              <FaUserInjured />
              Patients
            </NavLink>

          </li>

          {/* Receptionists */}

          <li>

            <NavLink
              to="/admin/receptionists"
              className={menuClass}
            >
              <FaUserNurse />
              Receptionists
            </NavLink>

          </li>

          {/* Appointments */}

          <li>

            <NavLink
              to="/admin/appointments"
              className={menuClass}
            >
              <FaCalendarAlt />
              Appointments
            </NavLink>

          </li>

          {/* Reports */}

          <li>

            <NavLink
              to="/admin/reports"
              className={menuClass}
            >
              <FaMoneyBillWave />
              Revenue Reports
            </NavLink>

          </li>

          {/* Analytics */}

          

          {/* Settings */}

          <li>

            <NavLink
              to="/admin/settings"
              className={menuClass}
            >
              <FaCog />
              Hospital Settings
            </NavLink>

          </li>

        </ul>

      </div>

      {/* Logout */}

      <div className="border-t border-slate-800 p-4">

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 py-3 rounded-xl font-semibold transition"
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;