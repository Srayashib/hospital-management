const days = [
  "",
  "",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31",
];

const CalendarWidget = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">

      <h2 className="text-xl font-bold text-slate-800 mb-5">
        July 2026
      </h2>

      <div className="grid grid-cols-7 gap-2 text-center text-sm font-semibold text-slate-500 mb-4">

        <div>Su</div>
        <div>Mo</div>
        <div>Tu</div>
        <div>We</div>
        <div>Th</div>
        <div>Fr</div>
        <div>Sa</div>

      </div>

      <div className="grid grid-cols-7 gap-2">

        {days.map((day, index) => (

          <div
            key={index}
            className={`aspect-square flex items-center justify-center rounded-lg cursor-pointer transition
              ${
                day === "27"
                  ? "bg-sky-500 text-white font-bold"
                  : "hover:bg-slate-100 text-slate-600"
              }`}
          >
            {day}
          </div>

        ))}

      </div>

      <div className="mt-5 rounded-xl bg-sky-50 p-4">

        <h4 className="font-semibold text-sky-700">
          Today's Appointments
        </h4>

        <p className="text-sm text-slate-600 mt-2">
          • 12 Appointments Scheduled
        </p>

      </div>

    </div>
  );
};

export default CalendarWidget;