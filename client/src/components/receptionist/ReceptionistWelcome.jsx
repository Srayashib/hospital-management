import { FaCalendarDay } from "react-icons/fa";

const ReceptionistWelcome = () => {

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  return (
    <section className="receptionist-welcome">

      <div className="receptionist-welcome-content">

        <span className="receptionist-welcome-label">
          RECEPTION DESK
        </span>

        <h1>
          Welcome back, {user.name || "Receptionist"} 👋
        </h1>

        <p>
          Manage patients, appointments and daily
          reception activities from one place.
        </p>

      </div>


      <div className="receptionist-welcome-date">

        <FaCalendarDay />

        <div>
          <span>Today</span>

          <strong>
            {new Date().toLocaleDateString(
              "en-US",
              {
                weekday: "long",
                month: "short",
                day: "numeric",
              }
            )}
          </strong>
        </div>

      </div>

    </section>
  );
};

export default ReceptionistWelcome;