import { useEffect, useState } from "react";

import {
  FiChevronRight,
  FiFileText,
  FiDownload,
  FiExternalLink,
} from "react-icons/fi";

import {
  getMyMedicalHistory,
} from "../../services/patientProfileService";

const API_URL = "http://localhost:5000";

const PatientRecentPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPrescriptions = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getMyMedicalHistory();

        const appointments =
          response?.appointments || [];

        // =================================================
        // GET ONLY MEDICAL RECORDS WITH PRESCRIPTION FILE
        // =================================================

        const recentPrescriptions = appointments
          .filter((appointment) => {
            const prescription =
              appointment?.medicalRecord?.documents
                ?.prescription;

            return (
              prescription?.path &&
              prescription.path.trim() !== ""
            );
          })
          .map((appointment) => {
            const prescription =
              appointment.medicalRecord.documents
                .prescription;

            return {
              id:
                appointment.medicalRecord._id ||
                appointment._id,

              doctor:
                appointment.doctor?.name ||
                "Doctor",

              department:
                appointment.doctor?.department ||
                appointment.doctor?.qualification ||
                "Medical Consultation",

              date:
                appointment.date,

              startTime:
                appointment.startTime,

              originalName:
                prescription.originalName ||
                "Prescription",

              path:
                prescription.path,

              mimeType:
                prescription.mimeType || "",

              createdAt:
                appointment.medicalRecord.createdAt ||
                appointment.date,
            };
          });

        // =================================================
        // SORT NEWEST FIRST
        // =================================================

        recentPrescriptions.sort((a, b) => {
          return (
            new Date(b.createdAt) -
            new Date(a.createdAt)
          );
        });

        // =================================================
        // SHOW ONLY 3
        // =================================================

        setPrescriptions(
          recentPrescriptions.slice(0, 3)
        );
      } catch (err) {
        console.error(
          "Failed to load recent prescriptions:",
          err
        );

        setError(
          err?.response?.data?.message ||
            "Failed to load prescriptions."
        );

        setPrescriptions([]);
      } finally {
        setLoading(false);
      }
    };

    loadPrescriptions();
  }, []);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(parsedDate.getTime())
    ) {
      return "-";
    }

    return parsedDate.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // FILE TYPE
  // =====================================================

  const isImage = (mimeType = "", path = "") => {
    return (
      mimeType.startsWith("image/") ||
      /\.(jpg|jpeg|png|webp)$/i.test(path)
    );
  };

  const isPdf = (mimeType = "", path = "") => {
    return (
      mimeType === "application/pdf" ||
      /\.pdf$/i.test(path)
    );
  };

  // =====================================================
  // FILE URL
  // =====================================================

  const getFileUrl = (path) => {
    if (!path) {
      return "#";
    }

    if (path.startsWith("http")) {
      return path;
    }

    return `${API_URL}${path}`;
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm">

        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">

          <div>
            <h3 className="font-bold text-slate-900 text-lg">
              Recent Prescriptions
            </h3>

            <p className="text-sm text-slate-400 mt-1">
              Your latest prescription documents
            </p>
          </div>

          <button className="text-sky-600">
            <FiChevronRight />
          </button>

        </div>

        <div className="p-6 space-y-4">

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="animate-pulse flex items-center gap-4"
            >

              <div className="w-12 h-12 rounded-xl bg-slate-200" />

              <div className="flex-1 space-y-2">

                <div className="h-4 bg-slate-200 rounded w-40" />

                <div className="h-3 bg-slate-200 rounded w-28" />

              </div>

              <div className="h-8 bg-slate-200 rounded-lg w-20" />

            </div>
          ))}

        </div>

      </section>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm">

        <div className="p-5 sm:p-6 border-b border-slate-100">

          <h3 className="font-bold text-slate-900 text-lg">
            Recent Prescriptions
          </h3>

          <p className="text-sm text-slate-400 mt-1">
            Your latest prescription documents
          </p>

        </div>

        <div className="p-6">

          <div className="rounded-xl border border-red-200 bg-red-50 p-4">

            <p className="text-sm text-red-600">
              {error}
            </p>

          </div>

        </div>

      </section>
    );
  }

  // =====================================================
  // NO PRESCRIPTIONS
  // =====================================================

  if (prescriptions.length === 0) {
    return (
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm">

        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">

          <div>

            <h3 className="font-bold text-slate-900 text-lg">
              Recent Prescriptions
            </h3>

            <p className="text-sm text-slate-400 mt-1">
              Your latest prescription documents
            </p>

          </div>

          <button className="text-sky-600">
            <FiChevronRight />
          </button>

        </div>

        <div className="p-8 text-center">

          <div className="mx-auto w-14 h-14 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center">

            <FiFileText className="text-2xl" />

          </div>

          <h4 className="mt-4 text-lg font-bold text-slate-900">
            No prescriptions yet
          </h4>

          <p className="mt-2 text-sm text-slate-500">
            Uploaded prescription documents will appear here.
          </p>

        </div>

      </section>
    );
  }

  // =====================================================
  // PRESCRIPTION LIST
  // =====================================================

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm">

      <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">

        <div>

          <h3 className="font-bold text-slate-900 text-lg">
            Recent Prescriptions
          </h3>

          <p className="text-sm text-slate-400 mt-1">
            Your latest prescription documents
          </p>

        </div>

        <button className="text-sky-600 hover:text-sky-700">
          <FiChevronRight />
        </button>

      </div>

      <div className="divide-y divide-slate-100">

        {prescriptions.map((prescription) => {
          const fileUrl =
            getFileUrl(prescription.path);

          return (
            <div
              key={prescription.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center gap-4"
            >

              {/* FILE ICON / PREVIEW */}

              <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center overflow-hidden shrink-0">

                {isImage(
                  prescription.mimeType,
                  prescription.path
                ) ? (
                  <img
                    src={fileUrl}
                    alt={
                      prescription.originalName
                    }
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiFileText className="text-xl" />
                )}

              </div>


              {/* DETAILS */}

              <div className="flex-1 min-w-0">

                <h4 className="font-semibold text-slate-800 truncate">
                  {prescription.originalName}
                </h4>

                <p className="text-sm text-slate-400 mt-1">
                  {prescription.doctor}
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  {prescription.department}
                  {" · "}
                  {formatDate(
                    prescription.date
                  )}
                </p>

              </div>


              {/* FILE TYPE */}

              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-violet-50 text-violet-600">
                {isPdf(
                  prescription.mimeType,
                  prescription.path
                )
                  ? "PDF"
                  : isImage(
                      prescription.mimeType,
                      prescription.path
                    )
                  ? "Image"
                  : "File"}
              </span>


              {/* VIEW */}

              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-sky-50 text-sky-600 text-sm font-semibold hover:bg-sky-100"
              >
                <FiExternalLink />
                View
              </a>

            </div>
          );
        })}

      </div>

    </section>
  );
};

export default PatientRecentPrescriptions;