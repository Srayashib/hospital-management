const activities = [
  {
    time: "10:00 AM",
    title: "Patient Registered",
  },
  {
    time: "11:15 AM",
    title: "Appointment Booked",
  },
  {
    time: "12:30 PM",
    title: "Doctor Added",
  },
  {
    time: "1:00 PM",
    title: "Department Updated",
  },
];

const ActivityTimeline = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">

      <h2 className="text-xl font-bold mb-6 text-slate-800">
        Activity Timeline
      </h2>

      <div className="space-y-6">

        {activities.map((item, index) => (

          <div
            key={index}
            className="flex gap-4"
          >

            <div className="flex flex-col items-center">

              <div className="w-3 h-3 rounded-full bg-sky-500"></div>

              {index !== activities.length - 1 && (
                <div className="w-[2px] h-14 bg-slate-200 mt-2"></div>
              )}

            </div>

            <div>

              <p className="text-sm text-slate-400">
                {item.time}
              </p>

              <h4 className="font-semibold text-slate-700">
                {item.title}
              </h4>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default ActivityTimeline;