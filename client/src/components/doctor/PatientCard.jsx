import {
  FaPhone,
  FaCalendarAlt,
  FaHeartbeat,
} from "react-icons/fa";

const PatientCard = ({
  name,
  age,
  disease,
  phone,
  appointment,
  image,
}) => {
  return (
    <div className="patient-card">

      <div className="patient-top">

        <img
          src={image}
          alt={name}
        />

        <div>

          <h4>{name}</h4>

          <p>{age} Years</p>

        </div>

      </div>

      <div className="patient-info">

        <p>

          <FaHeartbeat />

          {disease}

        </p>

        <p>

          <FaPhone />

          {phone}

        </p>

        <p>

          <FaCalendarAlt />

          {appointment}

        </p>

      </div>

      <button className="patient-view-btn">

        View Details

      </button>

    </div>
  );
};

export default PatientCard;