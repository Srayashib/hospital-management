import {
  FaCalendarCheck,
  FaUserInjured,
  FaCheckCircle,
  FaDollarSign,
} from "react-icons/fa";

const cards = [
  {
    title: "Today's Appointments",
    value: 18,
    icon: <FaCalendarCheck />,
    color: "card-blue",
  },
  {
    title: "Pending Patients",
    value: 7,
    icon: <FaUserInjured />,
    color: "card-orange",
  },
  {
    title: "Completed Today",
    value: 11,
    icon: <FaCheckCircle />,
    color: "card-green",
  },
  {
    title: "Today's Earnings",
    value: "₹14,500",
    icon: <FaDollarSign />,
    color: "card-purple",
  },
];

const DashboardCards = () => {
  return (
    <div className="dashboard-cards">

      {cards.map((card, index) => (

        <div
          className={`dashboard-card ${card.color}`}
          key={index}
        >

          <div className="card-icon">

            {card.icon}

          </div>

          <h2>{card.value}</h2>

          <p>{card.title}</p>

        </div>

      ))}

    </div>
  );
};

export default DashboardCards;