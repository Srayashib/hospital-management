import { useEffect, useState } from "react";

import {
  FaBars,
  FaBell,
  FaEnvelope,
  FaMoon,
  FaSearch,
  FaChevronDown,
} from "react-icons/fa";

import {
  getNotifications,
} from "../../services/notificationService";

import {
  useNavigate,
} from "react-router-dom";


const Topbar = () => {

  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] =
    useState(0);


  // ==========================================
  // LOAD UNREAD COUNT
  // ==========================================

  const loadNotificationCount =
    async () => {

      try {

        const response =
          await getNotifications();

        setUnreadCount(
          response.unreadCount || 0
        );

      } catch (error) {

        console.error(
          "Notification Count Error:",
          error
        );

      }

    };


  useEffect(() => {

    loadNotificationCount();


    // Check every 10 seconds
    const interval =
      setInterval(
        loadNotificationCount,
        10000
      );


    return () =>
      clearInterval(interval);

  }, []);


  return (

    <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between">

      {/* Left */}

      <div className="flex items-center gap-5">

        <button className="text-xl text-slate-700 hover:text-sky-600">

          <FaBars />

        </button>


        <div className="relative">

          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search doctor, patient..."
            className="w-96 pl-11 pr-4 py-3 rounded-xl border border-slate-300 outline-none focus:border-sky-500"
          />

        </div>

      </div>


      {/* Right */}

      <div className="flex items-center gap-5">


        {/* =====================================
            NOTIFICATION
        ===================================== */}

        <button
          type="button"
          onClick={() =>
            navigate("/admin/notifications")
          }
          className="relative w-11 h-11 rounded-xl bg-slate-100 hover:bg-sky-100 flex items-center justify-center transition"
        >

          <FaBell />


          {/* RED BADGE */}

          {unreadCount > 0 && (

            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center border-2 border-white">

              {unreadCount > 99
                ? "99+"
                : unreadCount}

            </span>

          )}

        </button>


        {/* Email */}

        <button className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-sky-100 flex items-center justify-center transition">

          <FaEnvelope />

        </button>


        {/* Moon */}

        <button className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-sky-100 flex items-center justify-center transition">

          <FaMoon />

        </button>


        {/* Admin */}

        <div className="flex items-center gap-3 cursor-pointer">

          <img
            src="https://i.pravatar.cc/100"
            alt="Admin"
            className="w-11 h-11 rounded-full border-2 border-sky-500"
          />

          <div>

            <h4 className="font-semibold text-slate-700">
              Admin
            </h4>

            <p className="text-sm text-slate-500">
              Super Administrator
            </p>

          </div>

          <FaChevronDown className="text-slate-500" />

        </div>

      </div>

    </header>

  );

};


export default Topbar;