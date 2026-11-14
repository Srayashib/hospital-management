import { useEffect, useState } from "react";
import {
  FaMoneyBillWave,
  FaCalendarAlt,
  FaUserMd,
  FaCreditCard,
} from "react-icons/fa";

import {
  getPatientCompletedPayments,
} from "../../services/patientProfileService";

const Payments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getPatientCompletedPayments();

        if (response?.success) {
          setAppointments(
            response.appointments || []
          );
        } else {
          setAppointments([]);
        }
      } catch (err) {
        console.error(
          "Failed to load patient payments:",
          err
        );

        setError(
          err?.response?.data?.message ||
            "Failed to load payments."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatPaidDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatMethod = (method) => {
    if (!method) return "-";

    if (method === "PayPal") return "PayPal";
    if (method === "QR") return "QR Payment";
    if (method === "Card") return "Card";
    if (method === "Cash") return "Cash";

    return method;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Payments
        </h1>

        <p className="text-slate-500 mt-2">
          View payments for your completed consultations.
        </p>
      </div>


      {/* ERROR */}
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}


      {/* LOADING */}
      {loading && (
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-slate-500">
            Loading payments...
          </p>
        </div>
      )}


      {/* EMPTY */}
      {!loading && appointments.length === 0 && (
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sky-50 text-sky-500">
            <FaMoneyBillWave className="text-xl" />
          </div>

          <h2 className="text-lg font-semibold text-slate-900">
            No completed payments
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Payments will appear here after an appointment
            is completed.
          </p>
        </div>
      )}


      {/* PAYMENT LIST */}
      {!loading && appointments.length > 0 && (
        <div className="space-y-5">

          {appointments.map((appointment) => {

            const isPaid =
              appointment.paymentStatus === "Paid";

            const amount = Number(
              appointment.paymentAmount ||
                appointment.fee ||
                0
            );

            return (
              <div
                key={appointment._id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >

                {/* TOP */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                  <div>
                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                        <FaUserMd />
                      </div>

                      <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                          {appointment.doctor?.name ||
                            "Doctor"}
                        </h2>

                        <p className="text-sm text-slate-500">
                          {appointment.doctor
                            ?.department ||
                            "Medical Consultation"}
                        </p>
                      </div>

                    </div>
                  </div>


                  {/* PAYMENT STATUS */}
                  <div>
                    {isPaid ? (
                      <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                        Paid
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                        Payment Pending
                      </span>
                    )}
                  </div>

                </div>


                {/* DETAILS */}
                <div className="mt-5 grid grid-cols-1 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">

                  <div>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                      <FaCalendarAlt />
                      Appointment
                    </div>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {formatDate(
                        appointment.date
                      )}
                    </p>

                    <p className="text-xs text-slate-500">
                      {appointment.startTime} -{" "}
                      {appointment.endTime}
                    </p>
                  </div>


                  <div>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                      <FaMoneyBillWave />
                      Amount
                    </div>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      $
                      {amount.toLocaleString(
                        "en-US",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </p>
                  </div>


                  <div>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                      <FaCreditCard />
                      Payment Method
                    </div>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {isPaid
                        ? formatMethod(
                            appointment.paymentMethod
                          )
                        : "Not Paid"}
                    </p>
                  </div>


                  <div>
                    <div className="text-xs font-medium text-slate-400">
                      Paid On
                    </div>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {isPaid
                        ? formatPaidDate(
                            appointment.paidAt
                          )
                        : "-"}
                    </p>
                  </div>

                </div>


                {/* TRANSACTION */}
                {isPaid &&
                  appointment.paymentTransactionId && (
                    <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3">

                      <p className="text-xs font-medium text-slate-400">
                        Transaction ID
                      </p>

                      <p className="mt-1 break-all text-sm font-medium text-slate-700">
                        {
                          appointment.paymentTransactionId
                        }
                      </p>

                    </div>
                  )}

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
};

export default Payments;