import CountUp from "react-countup";

const StatCard = ({
  title,
  value,
  icon,
  color = "bg-sky-500",
  growth = "+0%",
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-slate-500 text-sm">
            {title}
          </p>

         <h2 className="text-3xl font-bold mt-2 text-slate-800">
  {value}
</h2>

          <span className="inline-block mt-4 text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm font-semibold">
            {growth}
          </span>

        </div>

        <div
          className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center text-white text-3xl shadow-lg`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
};

export default StatCard;