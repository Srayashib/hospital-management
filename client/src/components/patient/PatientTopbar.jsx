import { FiBell, FiMenu, FiSearch } from "react-icons/fi";

const PatientTopbar = () => {

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );


  /* =====================================================
     PATIENT NAME
  ===================================================== */

  const patientName =
    user.name ||
    user.fullName ||
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    "Patient";


  /* =====================================================
     INITIALS
  ===================================================== */

  const initials = patientName
    .split(" ")
    .filter(Boolean)
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();


  /* =====================================================
     OPEN MOBILE SIDEBAR
  ===================================================== */

  const openSidebar = () => {

    window.dispatchEvent(
      new CustomEvent("patient-open-sidebar")
    );

  };


  return (

    <header className="h-20 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between">


      {/* =================================================
          LEFT
      ================================================= */}

      <div className="flex items-center gap-4">


        {/* MOBILE MENU */}

        <button
          type="button"
          onClick={openSidebar}
          className="lg:hidden w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition cursor-pointer"
        >

          <FiMenu size={21} />

        </button>


        <div>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Patient Dashboard
          </h2>

          <p className="hidden sm:block text-sm text-slate-400">
            Manage your healthcare in one place
          </p>

        </div>

      </div>


      {/* =================================================
          RIGHT
      ================================================= */}

      <div className="flex items-center gap-3">


        {/* SEARCH */}

        <button
          type="button"
          className="hidden sm:flex w-10 h-10 rounded-xl border border-slate-200 items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer"
        >

          <FiSearch />

        </button>


        {/* NOTIFICATION */}

        <button
          type="button"
          className="relative w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer"
        >

          <FiBell />

          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />

        </button>


        {/* PATIENT */}

        <div className="flex items-center gap-3">

          <div className="hidden sm:block text-right">

            <p className="text-sm font-semibold text-slate-800">
              {patientName}
            </p>

            <p className="text-xs text-slate-400">
              Patient
            </p>

          </div>


          <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
            {initials}
          </div>

        </div>

      </div>

    </header>

  );
};

export default PatientTopbar;