import { useEffect, useState } from "react";

import {
  FaBell,
  FaCalendarAlt,
  FaUserMd,
  FaClock,
} from "react-icons/fa";

import {
  getNotifications,
  markNotificationAsRead,
} from "../../services/notificationService";

import { useNavigate } from "react-router-dom";


const Notifications = () => {

  const navigate = useNavigate();

  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  // ==========================================
  // LOAD NOTIFICATIONS
  // ==========================================

  useEffect(() => {

    loadNotifications();

  }, []);


  const loadNotifications = async () => {

    try {

      const response =
        await getNotifications();

      console.log(
        "NOTIFICATIONS:",
        response
      );

      setNotifications(
        response.notifications || []
      );

    } catch (error) {

      console.error(
        "Notification Error:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // CLICK NOTIFICATION
  // ==========================================

  const handleNotificationClick = async (
    notification
  ) => {

    try {

      console.log(
        "CLICKED NOTIFICATION:",
        notification
      );

      // --------------------------------------
      // IMPORTANT
      // --------------------------------------

      await markNotificationAsRead(
        notification._id
      );


      // --------------------------------------
      // Update UI immediately
      // --------------------------------------

      setNotifications((previous) =>
        previous.map((item) =>
          item._id === notification._id
            ? {
                ...item,
                isRead: true,
              }
            : item
        )
      );


      // --------------------------------------
      // Go to leave page
      // --------------------------------------

      if (
        notification.type === "leave" &&
        notification.leave
      ) {

        navigate(
          `/admin/leaves?leaveId=${notification.leave._id}`
        );

      }

    } catch (error) {

      console.error(
        "Notification click error:",
        error
      );

    }

  };


  if (loading) {

    return (
      <div className="p-8">
        Loading notifications...
      </div>
    );

  }


  return (

    <div className="p-8">

      <div className="mb-6">

        <h1 className="text-2xl font-bold text-slate-800">
          Notifications
        </h1>

        <p className="text-slate-500 mt-1">
          Recent hospital notifications
        </p>

      </div>


      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

        {notifications.length === 0 ? (

          <div className="p-12 text-center">

            <FaBell className="mx-auto text-4xl text-slate-300 mb-4" />

            <h3 className="font-semibold text-slate-700">
              No notifications
            </h3>

            <p className="text-sm text-slate-400 mt-1">
              You don't have any notifications.
            </p>

          </div>

        ) : (

          <div>

            {notifications.map(
              (notification) => (

                <button
                  key={notification._id}
                  type="button"
                  onClick={() =>
                    handleNotificationClick(
                      notification
                    )
                  }
                  className={`w-full text-left p-5 border-b border-slate-100 flex items-center gap-4 transition hover:bg-slate-50 ${
                    !notification.isRead
                      ? "bg-sky-50"
                      : "bg-white"
                  }`}
                >

                  {/* Icon */}

                  <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0">

                    <FaCalendarAlt />

                  </div>


                  {/* Content */}

                  <div className="flex-1">

                    <div className="flex items-center gap-2">

                      <h3 className="font-semibold text-slate-800">

                        {notification.title}

                      </h3>


                      {!notification.isRead && (

                        <span className="w-2.5 h-2.5 bg-red-500 rounded-full" />

                      )}

                    </div>


                    <p className="text-sm text-slate-500 mt-1">

                      {notification.message}

                    </p>


                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">

                      <FaClock />

                      {new Date(
                        notification.createdAt
                      ).toLocaleString()}

                    </div>

                  </div>


                  {/* Doctor */}

                  {notification.doctor && (

                    <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">

                      <FaUserMd />

                      {notification.doctor.name}

                    </div>

                  )}

                </button>

              )
            )}

          </div>

        )}

      </div>

    </div>

  );

};


export default Notifications;