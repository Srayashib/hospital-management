import { useEffect, useState } from "react";

import {
  FaUser,
    FaChevronLeft,
  FaChevronRight,
  FaVenusMars,
    FaTrash,
    FaSearch,
} from "react-icons/fa";

import {
  getAdminPatients,
  deleteAdminPatient,
} from "../../services/adminService";

const Patients = () => {
  const [patients, setPatients] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");
  const [deletingId, setDeletingId] =
  useState("");
  const [deletePatient, setDeletePatient] =
    useState(null);

  const [deleteLoading, setDeleteLoading] =
    useState(false);
  const [currentPage, setCurrentPage] =
  useState(1);
  const [searchTerm, setSearchTerm] = useState("");



const patientsPerPage = 10;

  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getAdminPatients();

        if (response?.success) {
          setPatients(
            response.patients || []
          );
        } else {
          setPatients([]);
        }
      } catch (err) {
        console.error(
          "Failed to load admin patients:",
          err
        );

        setError(
          err?.response?.data?.message ||
            "Failed to load patients."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);
// =====================================================
// OPEN DELETE MODAL
// =====================================================

const handleDeletePatient = (patient) => {
  setDeletePatient(patient);
  setError("");
};


const confirmDeletePatient = async () => {
  if (!deletePatient?._id) {
    return;
  }

  try {
    setDeleteLoading(true);
    setDeletingId(deletePatient._id);
    setError("");

    const response =
      await deleteAdminPatient(
        deletePatient._id
      );

    if (!response?.success) {
      throw new Error(
        response?.message ||
          "Failed to delete patient."
      );
    }

    // Remove patient from table
    setPatients((prevPatients) =>
      prevPatients.filter(
        (item) =>
          item._id !== deletePatient._id
      )
    );

    // Close popup
    setDeletePatient(null);

  } catch (err) {
    console.error(
      "Failed to delete patient:",
      err
    );

    setError(
      err?.response?.data?.message ||
        err.message ||
        "Failed to delete patient."
    );

  } finally {
    setDeleteLoading(false);
    setDeletingId("");
  }
};


// =====================================================
// SEARCH PATIENTS
// =====================================================

const filteredPatients = patients.filter((patient) => {
  const term = searchTerm.trim().toLowerCase();

  if (!term) {
    return true;
  }

  const searchableValues = [
    patient.name,
    patient.email,
    patient.phone,
    patient.age,
    patient.gender,
    patient.doctor?.name,
    patient.doctor?.department,
  ];

  return searchableValues.some((value) =>
    String(value ?? "")
      .toLowerCase()
      .includes(term)
  );
});


// =====================================================
// PAGINATION BASED ON SEARCH RESULTS
// =====================================================

const totalPatients = filteredPatients.length;

const totalPages = Math.ceil(
  totalPatients / patientsPerPage
);

const startIndex =
  (currentPage - 1) * patientsPerPage;

const endIndex =
  startIndex + patientsPerPage;

const currentPatients = filteredPatients.slice(
  startIndex,
  endIndex
);

const goToPage = (page) => {
  if (page < 1 || page > totalPages) {
    return;
  }

  setCurrentPage(page);
};


// =====================================================
// KEEP CURRENT PAGE VALID
// =====================================================

useEffect(() => {
  if (totalPages === 0 && currentPage !== 1) {
    setCurrentPage(1);
  } else if (
    totalPages > 0 &&
    currentPage > totalPages
  ) {
    setCurrentPage(totalPages);
  }
}, [totalPages, currentPage]);
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">

        <div>

          <h2 className="text-2xl font-bold text-slate-900">
            Patients
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            All registered patients
          </p>

        </div>


      </div>
{/* =====================================================
    SEARCH BAR
===================================================== */}

<div className="mb-6">
  <div className="relative w-full max-w-md">

    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

    <input
      type="search"
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
      }}
      onKeyDown={(e) => {
  if (e.key === "Enter") {
    e.preventDefault();
  }
}}
      placeholder="Search by name, email, phone, age..."
      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
    />

  </div>

  {!loading && !error && (
    <p className="mt-2 text-xs text-slate-500">
      Showing {filteredPatients.length} of {patients.length} patients
    </p>
  )}
</div>
{/* NO SEARCH RESULTS */}

{!loading &&
  !error &&
  patients.length > 0 &&
  filteredPatients.length === 0 && (
    <div className="py-10 text-center">

      <div className="mx-auto w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
        <FaSearch />
      </div>

      <h3 className="mt-4 font-semibold text-slate-800">
        No matching patients
      </h3>

      <p className="text-sm text-slate-500 mt-1">
        Try another name, email, phone number, age, or gender.
      </p>

      <button
        type="button"
        onClick={() => {
          setSearchTerm("");
          setCurrentPage(1);
        }}
        className="mt-4 text-sm font-semibold text-sky-600 hover:text-sky-700"
      >
        Clear search
      </button>

    </div>
  )}
      {/* ERROR */}

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}


      {/* LOADING */}

      {loading && (
        <div className="py-10 text-center text-slate-500">
          Loading patients...
        </div>
      )}


      {/* EMPTY */}

      {!loading &&
        !error &&
        patients.length === 0 && (
          <div className="py-10 text-center">

            <div className="mx-auto w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
              <FaUser />
            </div>

            <h3 className="mt-4 font-semibold text-slate-800">
              No patients found
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              No patient accounts are registered yet.
            </p>

          </div>
        )}


      {/* TABLE */}

      {!loading &&
        !error &&
       filteredPatients.length > 0 && (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="border-b border-slate-200">

                <tr className="text-left">

                  <th className="px-4 py-3 text-sm font-semibold text-slate-500">
                    Name
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold text-slate-500">
                    Age
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold text-slate-500">
                    Gender
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-500 text-right">
                    Actions
                  </th>

                  

                </tr>

              </thead>


              <tbody>

               {currentPatients.map(
                  (patient) => (

                    <tr
                      key={patient._id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >

                      {/* NAME */}

                      <td className="px-4 py-4">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                            <FaUser />
                          </div>

                          <div>

                            <p className="font-semibold text-slate-800">
                              {patient.name}
                            </p>

                            <p className="text-xs text-slate-400">
                              {patient.email}
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* AGE */}

                      <td className="px-4 py-4 text-sm text-slate-600">

                        {patient.age !== null &&
                        patient.age !== undefined
                          ? patient.age
                          : "N/A"}

                      </td>


                      {/* GENDER */}

                      <td className="px-4 py-4">

                        <div className="flex items-center gap-2 text-sm text-slate-600">

                          <FaVenusMars className="text-slate-400" />

                          {patient.gender ||
                            "N/A"}

                        </div>

                      </td>
                      {/* DELETE */}

<td className="px-4 py-4 text-right">

  <button
    type="button"
    onClick={() =>
      handleDeletePatient(patient)
    }
    disabled={
      deletingId === patient._id
    }
    className="
      inline-flex
      items-center
      justify-center
      gap-2
      px-3
      py-2
      rounded-lg
      text-sm
      font-semibold
      bg-red-50
      text-red-600
      hover:bg-red-100
      transition
      disabled:opacity-50
      disabled:cursor-not-allowed
    "
  >

    <FaTrash />

    {deletingId === patient._id
      ? "Deleting..."
      : "Delete"}

  </button>

</td>


                      {/* DOCTOR */}

                      

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      {/* =====================================================
          DELETE CONFIRMATION MODAL
      ===================================================== */}

      {deletePatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          {/* BACKDROP */}

          <button
            type="button"
            aria-label="Close delete dialog"
            onClick={() => {
              if (!deleteLoading) {
                setDeletePatient(null);
              }
            }}
            className="absolute inset-0 bg-slate-900/50"
          />

          {/* MODAL */}

          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200">

            {/* HEADER */}

            <div className="p-5 border-b border-slate-100">

              <div className="flex items-start gap-4">

                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">

                  <FaTrash />

                </div>

                <div>

                  <h3 className="text-lg font-bold text-slate-900">
                    Delete Patient
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Are you sure you want to delete this patient?
                  </p>

                </div>

              </div>

            </div>


            {/* PATIENT INFO */}

            <div className="p-5">

              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">

                    <FaUser />

                  </div>

                  <div className="min-w-0">

                    <p className="font-semibold text-slate-800">
                      {deletePatient.name}
                    </p>

                    <p className="text-sm text-slate-400 truncate">
                      {deletePatient.email}
                    </p>

                  </div>

                </div>

              </div>

              <p className="text-sm text-slate-500 mt-4">
                This will permanently remove the patient account
                and patient profile.
              </p>

            </div>


            {/* ACTIONS */}

            <div className="px-5 py-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">

              <button
                type="button"
                disabled={deleteLoading}
                onClick={() =>
                  setDeletePatient(null)
                }
                className="
                  px-4
                  py-2.5
                  rounded-xl
                  border
                  border-slate-200
                  text-sm
                  font-semibold
                  text-slate-700
                  hover:bg-slate-50
                  transition
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleteLoading}
                onClick={confirmDeletePatient}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-4
                  py-2.5
                  rounded-xl
                  bg-red-600
                  text-white
                  text-sm
                  font-semibold
                  hover:bg-red-700
                  transition
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >

                <FaTrash />

                {deleteLoading
                  ? "Deleting..."
                  : "Delete Patient"}

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Patients;