
import { useEffect, useState } from "react";
import {
  FaMoneyBillWave,
  FaCalendarCheck,
  FaClock,
  FaSearch,
  FaDownload,
  FaChartPie,
} from "react-icons/fa";

import { getAdminRevenueReport } from "../../services/adminService";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const formatDate = (value) => {
  if (!value) return "N/A";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const RevenueReports = () => {
  const [report, setReport] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReport = async (filters = {}) => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminRevenueReport(filters);

      if (!response?.success) {
        throw new Error("Unable to load the revenue report.");
      }

      setReport(response);
    } catch (err) {
      console.error("Revenue report fetch error:", err);

      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to load revenue report."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const handleFilter = (event) => {
    event.preventDefault();

    if (startDate && endDate && startDate > endDate) {
      setError("Start date cannot be after end date.");
      return;
    }

    loadReport({ startDate, endDate });
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    loadReport({});
  };

  const exportCSV = () => {
    const rows = report?.transactions || [];

    if (!rows.length) return;

    const columns = [
      ["Patient", "patient"],
      ["Email", "patientEmail"],
      ["Doctor", "doctor"],
      ["Department", "department"],
      ["Appointment Date", "appointmentDate"],
      ["Payment Date", "paidAt"],
      ["Amount", "amount"],
      ["Payment Method", "paymentMethod"],
      ["Payment Status", "paymentStatus"],
      ["Transaction ID", "transactionID"],
    ];

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [
      columns.map(([label]) => escapeCSV(label)).join(","),
      ...rows.map((row) =>
        columns
          .map(([, key]) => {
            if (key === "appointmentDate" || key === "paidAt") {
              return escapeCSV(formatDate(row[key]));
            }

            return escapeCSV(row[key]);
          })
          .join(",")
      ),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "hospital-revenue-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const summary = report?.summary || {
    totalRevenue: 0,
    paidAppointmentCount: 0,
    pendingPaymentCount: 0,
    pendingPaymentAmount: 0,
  };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Revenue Reports
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Track collected revenue from completed and paid appointments.
          </p>
        </div>

        <button
          type="button"
          onClick={exportCSV}
          disabled={!report?.transactions?.length}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaDownload />
          Export CSV
        </button>
      </div>

      {/* DATE FILTER */}
      <form
        onSubmit={handleFilter}
        className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
      >
        <div className="mb-4 flex items-center gap-2">
          <FaSearch className="text-sky-600" />
          <h2 className="font-semibold text-slate-800">
            Filter by payment date
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
          <div>
            <label
              htmlFor="startDate"
              className="mb-2 block text-sm font-medium text-slate-600"
            >
              Start date
            </label>

            <input
              id="startDate"
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(event) => setStartDate(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="mb-2 block text-sm font-medium text-slate-600"
            >
              End date
            </label>

            <input
              id="endDate"
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(event) => setEndDate(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Apply Filters"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Reset
          </button>
        </div>
      </form>

      {/* ERROR */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Revenue Collected
            </p>
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <FaMoneyBillWave />
            </span>
          </div>

          <h3 className="mt-4 text-2xl font-bold text-slate-900">
            {formatCurrency(summary.totalRevenue)}
          </h3>

          <p className="mt-2 text-xs text-slate-500">
            Completed appointments with paid status
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Paid Appointments
            </p>
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <FaCalendarCheck />
            </span>
          </div>

          <h3 className="mt-4 text-2xl font-bold text-slate-900">
            {summary.paidAppointmentCount}
          </h3>

          <p className="mt-2 text-xs text-slate-500">
            Included in collected revenue
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Pending Payments
            </p>
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <FaClock />
            </span>
          </div>

          <h3 className="mt-4 text-2xl font-bold text-slate-900">
            {summary.pendingPaymentCount}
          </h3>

          <p className="mt-2 text-xs text-slate-500">
            Completed appointments not yet paid
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Outstanding Amount
            </p>
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <FaChartPie />
            </span>
          </div>

          <h3 className="mt-4 text-2xl font-bold text-slate-900">
            {formatCurrency(summary.pendingPaymentAmount)}
          </h3>

          <p className="mt-2 text-xs text-slate-500">
            Not included in collected revenue
          </p>
        </div>
      </div>

      {loading && (
        <div className="rounded-2xl bg-white p-8 text-center text-slate-500 shadow-sm">
          Generating revenue report...
        </div>
      )}

      {!loading && report && !error && (
        <>
          {/* DEPARTMENT REVENUE */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800">
              Revenue by Department
            </h2>

            <p className="mb-5 mt-1 text-sm text-slate-500">
              Collected payments grouped by the doctor's department.
            </p>

            {report.departmentRevenue.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">
                No collected revenue for this period.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-left">
                      <th className="py-3 pr-4 text-sm font-semibold text-slate-500">
                        Department
                      </th>
                      <th className="py-3 pr-4 text-sm font-semibold text-slate-500">
                        Paid Appointments
                      </th>
                      <th className="py-3 text-right text-sm font-semibold text-slate-500">
                        Revenue
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {report.departmentRevenue.map((item) => (
                      <tr
                        key={item.department}
                        className="border-b border-slate-100"
                      >
                        <td className="py-4 font-medium text-slate-700">
                          {item.department}
                        </td>
                        <td className="py-4 text-slate-600">
                          {item.appointments}
                        </td>
                        <td className="py-4 text-right font-semibold text-green-700">
                          {formatCurrency(item.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* PAYMENT METHOD REVENUE */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800">
              Revenue by Payment Method
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {report.paymentMethodRevenue.map((item) => (
                <div
                  key={item.method}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                >
                  <p className="text-sm text-slate-500">
                    {item.method}
                  </p>
                  <p className="mt-2 text-xl font-bold text-slate-900">
                    {formatCurrency(item.revenue)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.appointments} paid appointments
                  </p>
                </div>
              ))}

              {report.paymentMethodRevenue.length === 0 && (
                <p className="text-sm text-slate-500">
                  No payment transactions found.
                </p>
              )}
            </div>
          </div>

          {/* COLLECTED REVENUE DETAILS */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800">
              Collected Revenue Details
            </h2>

            <p className="mb-5 mt-1 text-sm text-slate-500">
              Only completed and paid appointments are shown.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="border-b border-slate-200 text-left">
                    <th className="py-3 pr-4 text-sm text-slate-500">Patient</th>
                    <th className="py-3 pr-4 text-sm text-slate-500">Doctor</th>
                    <th className="py-3 pr-4 text-sm text-slate-500">Department</th>
                    <th className="py-3 pr-4 text-sm text-slate-500">Paid Date</th>
                    <th className="py-3 pr-4 text-sm text-slate-500">Method</th>
                    <th className="py-3 text-right text-sm text-slate-500">Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {report.transactions.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="py-4 pr-4">
                        <p className="font-medium text-slate-700">
                          {item.patient}
                        </p>
                        <p className="text-xs text-slate-400">
                          {item.patientEmail}
                        </p>
                      </td>

                      <td className="py-4 pr-4 text-sm text-slate-600">
                        {item.doctor}
                      </td>

                      <td className="py-4 pr-4 text-sm text-slate-600">
                        {item.department}
                      </td>

                      <td className="py-4 pr-4 text-sm text-slate-600">
                        {formatDate(item.paidAt)}
                      </td>

                      <td className="py-4 pr-4 text-sm text-slate-600">
                        {item.paymentMethod}
                      </td>

                      <td className="py-4 text-right font-semibold text-green-700">
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}

                  {report.transactions.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-8 text-center text-sm text-slate-500"
                      >
                        No paid appointments found for this period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* OUTSTANDING PAYMENTS */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800">
              Outstanding Payments
            </h2>

            <p className="mb-5 mt-1 text-sm text-slate-500">
              Completed appointments that still have a pending payment.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 text-left">
                    <th className="py-3 pr-4 text-sm text-slate-500">Patient</th>
                    <th className="py-3 pr-4 text-sm text-slate-500">Doctor</th>
                    <th className="py-3 pr-4 text-sm text-slate-500">Department</th>
                    <th className="py-3 pr-4 text-sm text-slate-500">Appointment Date</th>
                    <th className="py-3 text-right text-sm text-slate-500">Due Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {report.pendingPayments.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100"
                    >
                      <td className="py-4 pr-4 font-medium text-slate-700">
                        {item.patient}
                      </td>

                      <td className="py-4 pr-4 text-sm text-slate-600">
                        {item.doctor}
                      </td>

                      <td className="py-4 pr-4 text-sm text-slate-600">
                        {item.department}
                      </td>

                      <td className="py-4 pr-4 text-sm text-slate-600">
                        {formatDate(item.date)}
                      </td>

                      <td className="py-4 text-right font-semibold text-amber-700">
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}

                  {report.pendingPayments.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 text-center text-sm text-slate-500"
                      >
                        No outstanding completed appointments.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RevenueReports;
