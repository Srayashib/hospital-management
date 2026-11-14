import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiClock,
  FiActivity,
  FiChevronRight,
} from "react-icons/fi";

import { getDoctorPatients } from "../../services/doctorService";

const DoctorPatients = () => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getDoctorPatients();

      if (response?.success) {
        setPatients(response.patients || []);
      } else {
        setError(
          response?.message || "Failed to fetch patients."
        );
      }
    } catch (error) {
      console.error("Failed to fetch doctor patients:", error);

      setError(
        error.response?.data?.message ||
          "Failed to fetch patients."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getAge = (dateOfBirth) => {
    if (!dateOfBirth) return "N/A";

    const dob = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();

    const monthDifference =
      today.getMonth() - dob.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        today.getDate() < dob.getDate())
    ) {
      age--;
    }

    return `${age} years`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <div className="animate-pulse text-slate-500">
          Loading patients...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-red-200 p-6">
        <p className="text-red-600 font-medium">
          {error}
        </p>

        <button
          type="button"
          onClick={fetchPatients}
          className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
        <FiUser className="mx-auto text-4xl text-slate-300 mb-3" />

        <h3 className="text-lg font-semibold text-slate-700">
          No Patients Found
        </h3>

        <p className="text-sm text-slate-500 mt-1">
          No patient has completed an appointment with you yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">
              Total Patients
            </p>

            <h3 className="text-2xl font-bold text-slate-800">
              {patients.length}
            </h3>
          </div>

          <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
            <FiUser className="text-sky-600 text-xl" />
          </div>
        </div>
      </div>

      {/* Patients */}
      <div className="space-y-4">

        {patients.map((patient) => (
          <div
            key={patient._id}
            className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

              {/* Patient */}
              <div className="flex items-start gap-4">

                <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
                  <FiUser className="text-sky-600 text-xl" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    {patient.name}
                  </h3>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">

                    {patient.email && (
                      <span className="flex items-center gap-1">
                        <FiMail />
                        {patient.email}
                      </span>
                    )}

                    {patient.phone && (
                      <span className="flex items-center gap-1">
                        <FiPhone />
                        {patient.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Patient information */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                <div>
                  <p className="text-xs text-slate-400">
                    Age
                  </p>

                  <p className="text-sm font-medium text-slate-700">
                    {getAge(patient.dateOfBirth)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Gender
                  </p>

                  <p className="text-sm font-medium text-slate-700">
                    {patient.gender || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Blood Group
                  </p>

                  <p className="text-sm font-medium text-slate-700">
                    {patient.bloodGroup || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Completed Visits
                  </p>

                  <p className="text-sm font-medium text-slate-700">
                    {patient.completedAppointments || 0}
                  </p>
                </div>

              </div>

              {/* Action */}
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/doctor/medical-record/${patient._id}`
                  )
                }
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 transition"
              >
                View Medical History
                <FiChevronRight />
              </button>

            </div>

            {/* Last appointment */}
            {patient.lastAppointment && (
              <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap gap-5 text-sm text-slate-500">

                <span className="flex items-center gap-2">
                  <FiCalendar className="text-sky-600" />
                  Last Visit:{" "}
                  <strong className="text-slate-700">
                    {formatDate(
                      patient.lastAppointment.date
                    )}
                  </strong>
                </span>

                <span className="flex items-center gap-2">
                  <FiClock className="text-sky-600" />
                  {patient.lastAppointment.startTime} -{" "}
                  {patient.lastAppointment.endTime}
                </span>

                <span className="flex items-center gap-2">
                  <FiActivity className="text-sky-600" />
                  {patient.lastAppointment.reason || "General consultation"}
                </span>

              </div>
            )}

          </div>
        ))}

      </div>
    </div>
  );
};

export default DoctorPatients;