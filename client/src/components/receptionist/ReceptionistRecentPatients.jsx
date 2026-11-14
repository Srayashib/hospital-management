import {
  FaPhone,
  FaUser,
} from "react-icons/fa";

const ReceptionistRecentPatients = () => {

  const patients = [
    {
      name: "James Anderson",
      id: "PT-1001",
      phone: "9876543210",
      visit: "Today",
    },
    {
      name: "Olivia Thomas",
      id: "PT-1002",
      phone: "9876543211",
      visit: "Today",
    },
    {
      name: "William Taylor",
      id: "PT-1003",
      phone: "9876543212",
      visit: "Yesterday",
    },
    {
      name: "Ava Martinez",
      id: "PT-1004",
      phone: "9876543213",
      visit: "Yesterday",
    },
  ];

  return (
    <section className="receptionist-patients-card">

      <div className="receptionist-card-heading">

        <div>
          <h2>Recent Patients</h2>

          <p>
            Recently registered patients
          </p>
        </div>

        <button className="receptionist-view-all-btn">
          View All
        </button>

      </div>


      <div className="receptionist-patient-list">

        {patients.map((patient, index) => (

          <div
            className="receptionist-patient-row"
            key={index}
          >

            <div className="receptionist-patient-left">

              <div className="receptionist-patient-avatar">
                <FaUser />
              </div>

              <div>

                <strong>
                  {patient.name}
                </strong>

                <span>
                  {patient.id}
                </span>

              </div>

            </div>


            <div className="receptionist-patient-phone">

              <FaPhone />

              {patient.phone}

            </div>


            <span className="receptionist-patient-visit">
              {patient.visit}
            </span>

          </div>

        ))}

      </div>

    </section>
  );
};

export default ReceptionistRecentPatients;