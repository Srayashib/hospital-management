
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#0EA5E9",
  "#A855F7",
  "#64748B",
];

const AppointmentChart = ({ data = [] }) => {
  const chartData = data.map((item) => ({
    ...item,
    name: String(item.name)
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (letter) => letter.toUpperCase()),
  }));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">
          Appointments
        </h2>

        <p className="text-slate-500 text-sm">
          Appointment Status Overview
        </p>
      </div>

      {chartData.length === 0 ? (
        <div className="h-[320px] flex items-center justify-center text-slate-500">
          No appointment data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={4}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default AppointmentChart;
