import { FaBell, FaSearch } from "react-icons/fa";

const DoctorHeader = () => {
  return (
    <div className="doctor-header">

      <div className="doctor-header-left">

        <h2>Doctor Dashboard</h2>

        <p>Welcome back 👨‍⚕️ Have a productive day.</p>

      </div>

      <div className="doctor-header-right">

        <div className="header-search">

          <FaSearch />

          <input
            type="text"
            placeholder="Search patient..."
          />

        </div>

        <button className="notification-btn">

          <FaBell />

          <span className="notification-dot"></span>

        </button>

      </div>

    </div>
  );
};

export default DoctorHeader;