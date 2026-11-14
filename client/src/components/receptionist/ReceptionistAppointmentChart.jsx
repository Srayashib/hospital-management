import { useEffect, useMemo, useState } from "react";

import {
  getReceptionistAppointmentChart,
} from "../../services/receptionistService";

const ReceptionistAppointmentChart = () => {
  const [period, setPeriod] = useState("this-week");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH CHART DATA
  // =====================================================

  useEffect(() => {
    const loadChart = async () => {
      try {
        setLoading(true);

        const response =
          await getReceptionistAppointmentChart(
            period
          );

        if (response?.success) {
          setData(response.data || []);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error(
          "Failed to load appointment chart:",
          error
        );

        setData([]);
      } finally {
        setLoading(false);
      }
    };

    loadChart();
  }, [period]);

  // =====================================================
  // DYNAMIC MAX VALUE
  // =====================================================

  const maxValue = useMemo(() => {
    const highest = Math.max(
      ...data.map((item) =>
        Number(item.value || 0)
      ),
      0
    );

    if (highest <= 10) return 10;

    return (
      Math.ceil(highest / 10) * 10
    );
  }, [data]);

  // =====================================================
  // Y AXIS
  // =====================================================

  const yAxisValues = [
    maxValue,
    Math.round(maxValue * 0.75),
    Math.round(maxValue * 0.5),
    Math.round(maxValue * 0.25),
    0,
  ];

  return (
    <section className="receptionist-chart-card">

      <div className="receptionist-chart-header">

        <div>
          <h2>Appointments Overview</h2>

          <p>
            {period === "this-week"
              ? "Appointment activity this week"
              : period === "last-week"
              ? "Appointment activity last week"
              : "Appointment activity this month"}
          </p>
        </div>

        <select
          className="receptionist-chart-select"
          value={period}
          onChange={(e) =>
            setPeriod(e.target.value)
          }
        >
          <option value="this-week">
            This Week
          </option>

          <option value="last-week">
            Last Week
          </option>

          <option value="this-month">
            This Month
          </option>
        </select>

      </div>


      <div className="receptionist-chart">

        <div className="receptionist-chart-y">

          {yAxisValues.map(
            (value, index) => (
              <span key={index}>
                {value}
              </span>
            )
          )}

        </div>


        <div className="receptionist-chart-bars">

          {loading ? (
            <div className="receptionist-chart-loading">
              Loading...
            </div>
          ) : data.length === 0 ? (
            <div className="receptionist-chart-empty">
              No appointments found.
            </div>
          ) : (
            data.map((item, index) => {

              const value = Number(
                item.value || 0
              );

              const height =
                maxValue === 0
                  ? 0
                  : (value / maxValue) * 100;

              return (
                <div
                  className="receptionist-chart-column"
                  key={`${item.date}-${index}`}
                >

                  <div className="receptionist-chart-bar-wrapper">

                    <div
                      className="receptionist-chart-bar"
                      style={{
                        height: `${height}%`,
                      }}
                    >

                      {value > 0 && (
                        <span>
                          {value}
                        </span>
                      )}

                    </div>

                  </div>

                  <span className="receptionist-chart-day">
                    {item.day}
                  </span>

                </div>
              );
            })
          )}

        </div>

      </div>

    </section>
  );
};

export default ReceptionistAppointmentChart;