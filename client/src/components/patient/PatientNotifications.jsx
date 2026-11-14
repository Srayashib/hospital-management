const PatientNotifications = () => {

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">

      <div className="flex items-center justify-between mb-5">

        <div>

          <h3 className="font-bold text-slate-900 text-lg">
            Notifications
          </h3>

          <p className="text-sm text-slate-400 mt-1">
            Recent updates
          </p>

        </div>

        <span className="text-xs bg-sky-100 text-sky-700 px-2.5 py-1 rounded-full font-semibold">
          2 New
        </span>

      </div>


      <div className="space-y-4">

        <NotificationItem
          title="Appointment confirmed"
          text="Your appointment with Dr. Smith is confirmed."
          time="2h ago"
        />

        <NotificationItem
          title="Prescription available"
          text="Your new prescription is ready."
          time="Yesterday"
        />

      </div>

    </section>
  );
};


const NotificationItem = ({
  title,
  text,
  time,
}) => {

  return (
    <div className="flex gap-3">

      <div className="w-2 h-2 mt-2 rounded-full bg-sky-500 shrink-0" />

      <div>

        <p className="text-sm font-semibold text-slate-700">
          {title}
        </p>

        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          {text}
        </p>

        <p className="text-[11px] text-slate-300 mt-1">
          {time}
        </p>

      </div>

    </div>
  );
};

export default PatientNotifications;