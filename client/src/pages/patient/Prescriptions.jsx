import React, { useEffect, useState } from "react";
import { FiFileText, FiAlertCircle } from "react-icons/fi";
import { getMyMedicalHistory } from "../../services/patientProfileService";

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // PAGINATION
  // =====================================================

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyMedicalHistory();

        const appointments = response?.appointments || [];

        const prescriptionData = appointments.filter(
          (appointment) =>
            appointment.medicalRecord?.prescriptions?.length > 0
        );

        setPrescriptions(prescriptionData);
      } catch (error) {
        console.error("Failed to fetch prescriptions:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load prescriptions."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  // =====================================================
  // PAGINATION CALCULATIONS
  // =====================================================

  const totalPages = Math.ceil(
    prescriptions.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const currentPrescriptions =
    prescriptions.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  // =====================================================
  // CHANGE PAGE
  // =====================================================

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-3 text-red-600">
          <FiAlertCircle size={20} />

          <p className="text-sm font-semibold">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      <h1 className="text-2xl font-bold text-slate-900">
        Prescriptions
      </h1>

      <p className="text-slate-500 mt-2">
        View and download your prescriptions.
      </p>

      <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[700px]">

            <thead className="bg-slate-50">

              <tr>

                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500">
                  Date
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500">
                  Doctor
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500">
                  Prescription
                </th>

              </tr>

            </thead>

            <tbody>

              {currentPrescriptions.length > 0 ? (

                currentPrescriptions.map((appointment) => (

                  <tr
                    key={appointment._id}
                    className="border-t border-slate-100"
                  >

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(
                        appointment.date
                      ).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                      {appointment.doctor?.name || "N/A"}
                    </td>

                    <td className="px-6 py-4">

                      <div className="space-y-2">

                        {appointment.medicalRecord.prescriptions.map(
                          (medicine, index) => (

                            <div
                              key={index}
                              className="flex items-center gap-3 text-sm text-slate-700"
                            >

                              <FiFileText className="text-sky-500 shrink-0" />

                              <span>
                                {medicine.medicineName}
                              </span>

                            </div>

                          )
                        )}

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="3"
                    className="px-6 py-10 text-center text-sm text-slate-400"
                  >
                    No prescriptions found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* =====================================================
            PAGINATION
        ===================================================== */}

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-100">

            {/* Showing text */}

            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {startIndex + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-700">
                {Math.min(
                  startIndex + itemsPerPage,
                  prescriptions.length
                )}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {prescriptions.length}
              </span>
            </p>

            {/* Pagination buttons */}

            <div className="flex items-center gap-1">

              {/* Previous */}

              <button
                type="button"
                onClick={() =>
                  changePage(currentPage - 1)
                }
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>

              {/* Page Numbers */}

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (

                <button
                  key={page}
                  type="button"
                  onClick={() => changePage(page)}
                  className={`w-9 h-9 text-sm font-medium rounded-lg transition ${
                    currentPage === page
                      ? "bg-sky-600 text-white"
                      : "text-slate-600 hover:bg-sky-50"
                  }`}
                >
                  {page}
                </button>

              ))}

              {/* Next */}

              <button
                type="button"
                onClick={() =>
                  changePage(currentPage + 1)
                }
                disabled={
                  currentPage === totalPages
                }
                className="px-3 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next
              </button>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default Prescriptions;