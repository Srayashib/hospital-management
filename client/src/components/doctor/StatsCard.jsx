const StatsCard = ({
  title,
  value,
  icon,
  color,
}) => {
  return (
    <div className={`stats-card ${color}`}>

      <div className="stats-icon">

        {icon}

      </div>

      <div>

        <h2>{value}</h2>

        <p>{title}</p>

      </div>

    </div>
  );
};

export default StatsCard;