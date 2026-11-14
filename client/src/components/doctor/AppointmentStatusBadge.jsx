const AppointmentStatusBadge = ({ status }) => {

  const getClass = () => {

    switch (status) {

      case "Completed":
        return "status-completed";

      case "Pending":
        return "status-pending";

      case "Cancelled":
        return "status-cancelled";

      case "Confirmed":
        return "status-confirmed";

      default:
        return "status-default";

    }

  };

  return (
    <span className={`appointment-status ${getClass()}`}>
      {status}
    </span>
  );
};

export default AppointmentStatusBadge;