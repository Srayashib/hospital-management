import { useEffect, useState } from "react";

import {
  FaMoneyBillWave,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

import {
  getReceptionistDashboardStats,
} from "../../services/receptionistService";

const ReceptionistPaymentCard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response =
          await getReceptionistDashboardStats();

        if (response?.success) {
          setStats(response.stats);
        }
      } catch (error) {
        console.error(
          "Failed to load payment stats:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const formatMoney = (value) => {
    return `$${Number(value || 0).toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  const change = Number(
    stats?.collectionChange || 0
  );

  const isPositive = change >= 0;

  return (
    <section className="receptionist-payment-card">

      <div className="receptionist-payment-header">

        <div>
          <h2>Today's Collection</h2>

          <p>
            Payment summary
          </p>
        </div>

        <div className="receptionist-payment-icon">
          <FaMoneyBillWave />
        </div>

      </div>


      <div className="receptionist-payment-total">
        {loading
          ? "$0"
          : formatMoney(
              stats?.todayCollection
            )}
      </div>


      <div className="receptionist-payment-growth">

        {isPositive ? (
          <FaArrowUp />
        ) : (
          <FaArrowDown />
        )}

        <strong>
          {Math.abs(change)}%
        </strong>

        <span>
          compared with yesterday
        </span>

      </div>


      <div className="receptionist-payment-breakdown">

        <div>
          <span>Cash</span>

          <strong>
            {loading
              ? "$0"
              : formatMoney(
                  stats?.cashCollection
                )}
          </strong>
        </div>


        <div>
          <span>Card</span>

          <strong>
            {loading
              ? "$0"
              : formatMoney(
                  stats?.cardCollection
                )}
          </strong>
        </div>


        <div>
          <span>Online</span>

          <strong>
            {loading
              ? "$0"
              : formatMoney(
                  stats?.onlineCollection
                )}
          </strong>
        </div>

      </div>

    </section>
  );
};

export default ReceptionistPaymentCard;