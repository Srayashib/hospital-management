import { useNavigate } from "react-router-dom";

const SlotCard = ({ slots }) => {

  const navigate = useNavigate();

  const date = new Date(slots[0].date);

  const total = slots.length;

  const available = slots.filter(
    s => s.status === "Available"
  ).length;

  const booked = slots.filter(
    s => s.status === "Booked"
  ).length;

  const percentage = Math.round(
    (available / total) * 100
  );

  const handleViewSlots = () => {

    const d = new Date(slots[0].date);

    const selectedDate =
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    navigate(
      `/doctor/available-slots/${selectedDate}`
    );
    

  };

  return (

    <div className="slot-day-card">

      <div className="slot-header">

        <h3>
          {date.toLocaleDateString("en-IN",{
            weekday:"long",
            day:"numeric",
            month:"short",
          })}
        </h3>

      </div>

      <div className="slot-counts">

        <div className="count available">

          <h2>{available}</h2>

          <span>Available</span>

        </div>

        <div className="count booked">

          <h2>{booked}</h2>

          <span>Booked</span>

        </div>

      </div>

      <div className="progress">

        <div
          className="progress-fill"
          style={{
            width:`${percentage}%`
          }}
        />

      </div>

      <p className="progress-text">

        {percentage}% Slots Available

      </p>

      <button
        className="view-slots-btn"
        onClick={handleViewSlots}
      >
        View Slots
      </button>

    </div>

  );

};

export default SlotCard;