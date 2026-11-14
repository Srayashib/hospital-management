import {
  FaUserMd,
  FaUserPlus,
  FaCalendarTimes,
  FaFileInvoiceDollar,
} from "react-icons/fa";

const notifications = [
  {
    title: "Dr. Smith approved leave",
    time: "2 mins ago",
    icon: <FaUserMd />,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "New Patient Registered",
    time: "15 mins ago",
    icon: <FaUserPlus />,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Appointment Cancelled",
    time: "1 hour ago",
    icon: <FaCalendarTimes />,
    color: "bg-red-100 text-red-600",
  },
  {
    title: "Revenue Report Ready",
    time: "Today",
    icon: <FaFileInvoiceDollar />,
    color: "bg-purple-100 text-purple-600",
  },
];

const NotificationDropdown = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-96 overflow-hidden">

      <div className="px-6 py-4 border-b">

        <h3 className="font-bold text-lg text-slate-800">
          Notifications
        </h3>

      </div>

      {notifications.map((item, index) => (

        <div
          key={index}
          className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition cursor-pointer border-b last:border-none"
        >

          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center ${item.color}`}
          >
            {item.icon}
          </div>

          <div className="flex-1">

            <h4 className="font-semibold text-slate-700">
              {item.title}
            </h4>

            <p className="text-sm text-slate-400">
              {item.time}
            </p>

          </div>

        </div>

      ))}

      <div className="p-4 text-center">

        <button className="text-sky-600 font-semibold hover:text-sky-700">
          View All Notifications
        </button>

      </div>

    </div>
  );
};

export default NotificationDropdown;