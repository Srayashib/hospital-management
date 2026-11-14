import {
  FiUsers,
  FiCalendar,
  FiFileText,
  FiClipboard,
} from "react-icons/fi";

const PatientQuickActions = () => {

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">

      <h3 className="font-bold text-slate-900 text-lg">
        Quick Actions
      </h3>

      <p className="text-sm text-slate-400 mt-1 mb-5">
        Common patient actions
      </p>


      <div className="grid grid-cols-2 gap-3">

        <QuickAction
          icon={<FiUsers />}
          title="Find Doctor"
          bg="bg-sky-50"
          color="text-sky-600"
        />

        <QuickAction
          icon={<FiCalendar />}
          title="Book Visit"
          bg="bg-emerald-50"
          color="text-emerald-600"
        />

        <QuickAction
          icon={<FiFileText />}
          title="Records"
          bg="bg-violet-50"
          color="text-violet-600"
        />

        <QuickAction
          icon={<FiClipboard />}
          title="Prescriptions"
          bg="bg-amber-50"
          color="text-amber-600"
        />

      </div>

    </section>
  );
};


const QuickAction = ({
  icon,
  title,
  bg,
  color,
}) => {

  return (
    <button className="border border-slate-100 rounded-xl p-4 text-left hover:border-sky-200 hover:shadow-sm transition">

      <div
        className={`
          w-10 h-10 rounded-xl
          ${bg}
          ${color}
          flex items-center justify-center
          mb-3
        `}
      >
        {icon}
      </div>

      <p className="text-sm font-semibold text-slate-700">
        {title}
      </p>

    </button>
  );
};

export default PatientQuickActions;