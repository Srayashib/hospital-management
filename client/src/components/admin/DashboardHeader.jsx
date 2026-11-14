import { FaCalendarAlt } from "react-icons/fa";

const DashboardHeader = () => {
  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">

      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Welcome back,
          <span className="font-semibold text-sky-600">
            {" "}Administrator 👋
          </span>
        </p>
      </div>

      <div className="flex items-center gap-3 bg-white border border-slate-200 px-5 py-3 rounded-xl shadow-sm">

        <FaCalendarAlt className="text-sky-500" />

        <span className="text-slate-600 font-medium">
          {formattedDate}
        </span>

      </div>

    </div>
  );
};

export default DashboardHeader;