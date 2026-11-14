import {
  FaBell,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";

const ReceptionistHeader = () => {

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  return (
    <header className="receptionist-header">

      <div className="receptionist-header-search">

        <FaSearch />

        <input
          type="text"
          placeholder="Search patients, appointments..."
        />

      </div>


      <div className="receptionist-header-right">

        


        <div className="receptionist-user-profile">

          <FaUserCircle className="receptionist-user-icon" />

          <div className="receptionist-user-info">

            <strong>
              {user.name || "Receptionist"}
            </strong>

            <span>
              Receptionist
            </span>

          </div>

        </div>

      </div>

    </header>
  );
};

export default ReceptionistHeader;