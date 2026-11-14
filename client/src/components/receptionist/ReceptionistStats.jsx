import {
  FaUsers,
  FaCalendarCheck,
  FaUserClock,
  FaMoneyBillWave,
} from "react-icons/fa";

import { useEffect, useState } from "react";

import {
  getReceptionistDashboardStats,
} from "../../services/receptionistService";

const ReceptionistStats = () => {

  const [statsData, setStatsData] = useState({
    todayPatients: 0,
    todayAppointments: 0,
    waitingPatients: 0,
    todayCollection: 0,

    patientChange: 0,
    appointmentChange: 0,
    waitingChange: 0,
    collectionChange: 0,
  });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================================
  // LOAD STATS
  // =====================================================

  useEffect(() => {

    const loadStats = async () => {

      try {

        setLoading(true);
        setError("");

        const response =
          await getReceptionistDashboardStats();

        if (response.success) {

          setStatsData(
            response.stats || {}
          );

        } else {

          setError(
            response.message ||
            "Failed to load dashboard stats."
          );

        }

      } catch (error) {

        console.error(
          "Receptionist stats error:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Failed to load dashboard stats."
        );

      } finally {

        setLoading(false);

      }

    };

    loadStats();

  }, []);

  // =====================================================
  // FORMAT CHANGE
  // =====================================================

  const formatChange = (value) => {

    const number =
      Number(value || 0);

    if (number > 0) {
      return `+${number}%`;
    }

    return `${number}%`;
  };

  // =====================================================
  // STATS ARRAY
  // =====================================================

  const stats = [
    {
      title: "Today's Patients",

      value: loading
        ? "..."
        : statsData.todayPatients,

      change: loading
        ? "..."
        : formatChange(
            statsData.patientChange
          ),

      icon: <FaUsers />,
    },

    {
      title: "Today's Appointments",

      value: loading
        ? "..."
        : statsData.todayAppointments,

      change: loading
        ? "..."
        : formatChange(
            statsData.appointmentChange
          ),

      icon: <FaCalendarCheck />,
    },

    {
      title: "Waiting Patients",

      value: loading
        ? "..."
        : String(
            statsData.waitingPatients
          ).padStart(2, "0"),

      change: loading
        ? "..."
        : formatChange(
            statsData.waitingChange
          ),

      icon: <FaUserClock />,
    },

    {
      title: "Today's Collection",

      value: loading
        ? "..."
        : `$${Number(
            statsData.todayCollection || 0
          ).toLocaleString(
            "en-US",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}`,

      change: loading
        ? "..."
        : formatChange(
            statsData.collectionChange
          ),

      icon: <FaMoneyBillWave />,
    },
  ];

  // =====================================================
  // ERROR
  // =====================================================

  if (
    error &&
    !loading
  ) {
    console.error(error);
  }

  return (
    <section className="receptionist-stats-grid">

      {stats.map(
        (stat, index) => (

          <div
            className="receptionist-stat-card"
            key={index}
          >

            <div className="receptionist-stat-top">

              <div className="receptionist-stat-icon">
                {stat.icon}
              </div>

              <span className="receptionist-stat-change">
                {stat.change}
              </span>

            </div>

            <span className="receptionist-stat-title">
              {stat.title}
            </span>

            <strong className="receptionist-stat-value">
              {stat.value}
            </strong>

          </div>

        )
      )}

    </section>
  );
};

export default ReceptionistStats;