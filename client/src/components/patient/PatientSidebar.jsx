import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  FiHome,
  FiCalendar,
  FiUsers,
  FiUser,
  FiFileText,
  FiClipboard,
  FiCreditCard,
  FiBell,
  FiSettings,
  FiLogOut,
  FiX,
  FiHeart,
  FiMenu

} from "react-icons/fi";

const PatientSidebar = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();


  /* =====================================================
     GET LOGGED-IN PATIENT
  ===================================================== */

  const storedUser = localStorage.getItem("user");

  let user = {};

  try {

    user = storedUser
      ? JSON.parse(storedUser)
      : {};

  } catch (error) {

    console.error(
      "Failed to parse logged-in user:",
      error
    );

  }


  /* =====================================================
     PATIENT NAME
  ===================================================== */

  const patientName =
    user.name ||
    user.fullName ||
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    "Patient";


  /* =====================================================
     PATIENT EMAIL
  ===================================================== */

  const patientEmail =
    user.email || "Patient";


  /* =====================================================
     PATIENT INITIALS
  ===================================================== */

  const patientInitials = patientName
    .split(" ")
    .filter(Boolean)
    .map((name) => name.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();


  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setSidebarOpen(false);

    navigate("/login");

  };


  /* =====================================================
     OPEN SIDEBAR FROM TOPBAR
  ===================================================== */

  useEffect(() => {

    const openSidebar = () => {
      setSidebarOpen(true);
    };

    window.addEventListener(
      "patient-open-sidebar",
      openSidebar
    );

    return () => {

      window.removeEventListener(
        "patient-open-sidebar",
        openSidebar
      );

    };

  }, []);


  /* =====================================================
     MAIN MENU
  ===================================================== */

  const menuItems = [

    {
      path: "/patient/dashboard",
      icon: <FiHome />,
      label: "Dashboard",
    },

    {
      path: "/patient/appointments",
      icon: <FiCalendar />,
      label: "Appointments",
    },

    {
      path: "/patient/doctors",
      icon: <FiUsers />,
      label: "Find Doctors",
    },

    {
      path:"/patient/medical-history",
      icon: <FiFileText />,
      label: "Medical Records",
    },

    {
      path: "/patient/prescriptions",
      icon: <FiClipboard />,
      label: "Prescriptions",
    },

    {
      path: "/patient/payments",
      icon: <FiCreditCard />,
      label: "Payments",
    },

  ];


  /* =====================================================
     ACCOUNT MENU
  ===================================================== */

  const accountItems = [

    

    {
      path: "/patient/settings",
      icon: <FiSettings />,
      label: "Settings",
    },

     {
      path: "/patient/profile",
      icon: <FiUser />,
      label: "My Profile",
    },

  ];


  return (
    <>

      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {sidebarOpen && (

        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />

      )}


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen w-72
          bg-white border-r border-slate-200
          flex flex-col
          transition-transform duration-300
          lg:translate-x-0
          ${sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
          }
        `}
      >

        {/* =================================================
            LOGO
        ================================================= */}

        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-100">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-lg shadow-sky-600/20">

              <FiHeart size={20} />

            </div>


            <div>

              <h1 className="font-bold text-slate-900 text-lg">
                MediCare
              </h1>

              <p className="text-xs text-slate-400">
                Patient Portal
              </p>

            </div>

          </div>


          <button
  onClick={() => {
    window.dispatchEvent(
      new Event("patient-open-sidebar")
    );
  }}
  className="lg:hidden w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center cursor-pointer"
>
  <FiMenu size={21} />
</button>

        </div>


        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="flex-1 px-4 py-6 overflow-y-auto">

          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-3">
            Main Menu
          </p>


          <div className="space-y-1">

            {menuItems.map((item) => (

              <PatientSidebarItem
                key={item.path}
                {...item}
                onClick={() => setSidebarOpen(false)}
              />

            ))}

          </div>


          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mt-8 mb-3">
            Account
          </p>


          <div className="space-y-1">

            {accountItems.map((item) => (

              <PatientSidebarItem
                key={item.path}
                {...item}
                onClick={() => setSidebarOpen(false)}
              />

            ))}

          </div>

        </nav>


        {/* =================================================
            PROFILE
        ================================================= */}

        <div className="p-4 border-t border-slate-100">

          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50">

            {/* Avatar */}

            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold shrink-0">

              {patientInitials}

            </div>


            {/* Patient Information */}

            <div className="flex-1 min-w-0">

              <p className="text-sm font-semibold text-slate-800 truncate">
                {patientName}
              </p>

              <p className="text-xs text-slate-400 truncate">
                {patientEmail}
              </p>

            </div>


            {/* Logout */}

            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="text-slate-400 hover:text-red-500 cursor-pointer transition shrink-0"
            >

              <FiLogOut size={18} />

            </button>

          </div>

        </div>

      </aside>

    </>
  );
};


/* =====================================================
   SIDEBAR ITEM
===================================================== */

const PatientSidebarItem = ({
  path,
  icon,
  label,
  onClick,
}) => {

  return (

    <NavLink
      to={path}
      onClick={onClick}
      className={({ isActive }) => `
        w-full flex items-center gap-3
        px-3 py-3
        rounded-xl
        text-sm font-medium
        transition
        ${
          isActive
            ? "bg-sky-50 text-sky-700"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
        }
      `}
    >

      <span className="text-lg">
        {icon}
      </span>

      <span>
        {label}
      </span>

      <span className="ml-auto">

        <span
          className={`
            block w-1.5 h-1.5 rounded-full
            bg-sky-600
            ${"opacity-0"}
          `}
        />

      </span>

    </NavLink>

  );
};


export default PatientSidebar;