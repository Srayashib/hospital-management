import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";

const PatientWelcome = () => {

  const [patientName, setPatientName] = useState("Patient");

  useEffect(() => {

    const storedUser = localStorage.getItem("user");

    if (storedUser) {

      try {

        const user = JSON.parse(storedUser);

        // Use the name coming from logged-in user
        if (user.name) {
          setPatientName(user.name);
        }

      } catch (error) {

        console.error(
          "Failed to read patient user data:",
          error
        );

      }

    }

  }, []);


  return (
    <section className="mb-7">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <p className="text-sm text-slate-400 mb-1">
            Thursday, August 20, 2026
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Good afternoon, {patientName} 👋
          </h1>

          <p className="text-slate-500 mt-2">
            Here's what's happening with your health today.
          </p>

        </div>


        

      </div>

    </section>
  );
};

export default PatientWelcome;