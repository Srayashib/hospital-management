import {
  FaClock,
  FaUserMd,
} from "react-icons/fa";

const ReceptionistTodayAppointments = () => {

  const appointments = [
    {
      patient: "John Smith",
      doctor: "Dr. Sarah Wilson",
      time: "09:30 AM",
      status: "Checked In",
    },
    {
      patient: "Emma Johnson",
      doctor: "Dr. Michael Brown",
      time: "10:15 AM",
      status: "Waiting",
    },
    {
      patient: "Robert Davis",
      doctor: "Dr. Sarah Wilson",
      time: "11:00 AM",
      status: "Confirmed",
    },
    {
      patient: "Sophia Miller",
      doctor: "Dr. James Lee",
      time: "11:45 AM",
      status: "Waiting",
    },
  ];

  return (
    <section className="receptionist-appointments-card">

      <div className="receptionist-card-heading">

        <div>
          <h2>Today's Appointments</h2>

          <p>
            Upcoming appointments for today
          </p>
        </div>

        <button className="receptionist-view-all-btn">
          View All
        </button>

      </div>


      <div className="receptionist-appointment-list">

        {appointments.map(
          (appointment, index) => (

            <div
              className="receptionist-appointment-row"
              key={index}
            >

              <div className="receptionist-appointment-patient">

                <div className="receptionist-patient-avatar">
                  {appointment.patient.charAt(0)}
                </div>

                <div>
                  <strong>
                    {appointment.patient}
                  </strong>

                  <span>
                    <FaUserMd />
                    {appointment.doctor}
                  </span>
                </div>

              </div>


              <div className="receptionist-appointment-time">

                <FaClock />

                {appointment.time}

              </div>


              <span
                className={`receptionist-status receptionist-status-${appointment.status
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                {appointment.status}
              </span>

            </div>

          )
        )}

      </div>

    </section>
  );
};

export default ReceptionistTodayAppointments;