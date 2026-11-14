import {
  FaUserMd,
  FaHospital,
  FaUserPlus,
  FaCalendarPlus,
} from "react-icons/fa";

const actions = [
  {
    title: "Add Doctor",
    icon: <FaUserMd />,
    color: "bg-sky-500",
  },
  {
    title: "Add Department",
    icon: <FaHospital />,
    color: "bg-green-500",
  },
  {
    title: "Add Patient",
    icon: <FaUserPlus />,
    color: "bg-orange-500",
  },
  {
    title: "New Appointment",
    icon: <FaCalendarPlus />,
    color: "bg-purple-500",
  },
];

const QuickActions = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">

      <h2 className="text-xl font-bold mb-6 text-slate-800">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-4">

        {actions.map((item, index) => (

          <button
            key={index}
            className="group p-5 rounded-xl border border-slate-200 hover:border-sky-400 hover:shadow-lg transition duration-300"
          >

            <div
              className={`w-14 h-14 rounded-xl ${item.color} flex items-center justify-center text-white text-2xl mx-auto group-hover:scale-110 transition`}
            >
              {item.icon}
            </div>

            <h4 className="mt-4 font-semibold text-slate-700">
              {item.title}
            </h4>

          </button>

        ))}

      </div>

    </div>
  );
};

export default QuickActions;