
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const RevenueChart = ({ data = [] }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Revenue
          </h2>
          <p className="text-slate-500 text-sm">
            Monthly earnings
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis
            tickFormatter={(value) =>
              `₹${Number(value).toLocaleString("en-IN")}`
            }
          />

          <Tooltip
            formatter={(value) => [
              `₹${Number(value).toLocaleString("en-IN")}`,
              "Revenue",
            ]}
          />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#0EA5E9"
            strokeWidth={4}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
