import {
  FaCalendarAlt,
  FaClock,
  FaBan,
  FaUserMd,
  FaPrescriptionBottleAlt,
  FaFileMedical,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const actions = [
  {
    title: "Weekly Schedule",
    icon: <FaCalendarAlt />,
  },
  {
    title: "Available Slots",
    icon: <FaClock />,
  },
  {
    title: "Mark Leave",
    icon: <FaBan />,
  },
  {
    title: "Patient Details",
    icon: <FaUserMd />,
  },
  {
    title: "Prescriptions",
    icon: <FaPrescriptionBottleAlt />,
  },
  {
    title: "Medical Reports",
    icon: <FaFileMedical />,
  },
  {
    title: "Complete Appointment",
    icon: <FaCheckCircle />,
  },
  {
    title: "Cancel Appointment",
    icon: <FaTimesCircle />,
  },
];

const QuickActions = () => {
  return (
    <div className="quick-actions">

      {actions.map((item, index) => (

        <button
          key={index}
          className="quick-card"
        >

          <div className="quick-icon">

            {item.icon}

          </div>

          <span>{item.title}</span>

        </button>

      ))}

    </div>
  );
};

export default QuickActions;