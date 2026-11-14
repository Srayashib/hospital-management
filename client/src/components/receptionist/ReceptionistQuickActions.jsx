import { useNavigate } from "react-router-dom";

import {
  FaUserPlus,
  FaCalendarPlus,
  FaUserCheck,
  FaMoneyBillWave,
  FaUserMd,
} from "react-icons/fa";

const ReceptionistQuickActions = () => {

  const navigate = useNavigate();

  const actions = [
    
    {
      title: "Book Appointment",
      icon: <FaCalendarPlus />,
      path: "/receptionist/appointments/book",
    },
    {
      title: "Patient Check-In",
      icon: <FaUserCheck />,
      path: "/receptionist/patients/check-in",
    },
    {
      title: "Collect Payment",
      icon: <FaMoneyBillWave />,
      path: "/receptionist/payments",
    },
    {
      title: "Doctor Availability",
      icon: <FaUserMd />,
      path: "/receptionist/doctors",
    },
  ];

  return (
    <section className="receptionist-quick-section">

      <div className="receptionist-section-heading">

        <div>
          <h2>Quick Actions</h2>
          <p>Frequently used reception desk actions</p>
        </div>

      </div>


      <div className="receptionist-quick-grid">

        {actions.map((action, index) => (

          <button
            type="button"
            key={index}
            className="receptionist-quick-card"
            onClick={() => navigate(action.path)}
          >

            <span className="receptionist-quick-icon">
              {action.icon}
            </span>

            <span className="receptionist-quick-title">
              {action.title}
            </span>

          </button>

        ))}

      </div>

    </section>
  );
};

export default ReceptionistQuickActions;