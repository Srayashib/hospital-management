
import Appointment from "../models/Appointment.js";

// =====================================================
// ADMIN REVENUE REPORT
// Revenue counts only when appointment is Completed
// AND paymentStatus is Paid.
// =====================================================

export const getRevenueReport = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const { startDate, endDate } = req.query;

    // Validate date filters
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (
      (startDate && !datePattern.test(startDate)) ||
      (endDate && !datePattern.test(endDate))
    ) {
      return res.status(400).json({
        success: false,
        message: "Dates must use YYYY-MM-DD format.",
      });
    }

    const dateFilter = {};

    if (startDate) {
      const start = new Date(`${startDate}T00:00:00.000Z`);

      if (Number.isNaN(start.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid start date.",
        });
      }

      dateFilter.$gte = start;
    }

    if (endDate) {
      const end = new Date(`${endDate}T00:00:00.000Z`);
      end.setUTCDate(end.getUTCDate() + 1);

      if (Number.isNaN(end.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid end date.",
        });
      }

      dateFilter.$lt = end;
    }

    if (startDate && endDate && startDate > endDate) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be after end date.",
      });
    }

    // Revenue report is based on when payment was collected.
    // It includes only Completed + Paid appointments.
    const paidMatch = {
      status: "Completed",
      paymentStatus: "Paid",
    };

    if (Object.keys(dateFilter).length > 0) {
      paidMatch.paidAt = dateFilter;
    }

    const paidAppointments = await Appointment.find(paidMatch)
      .populate("patient", "name email phone")
      .populate("doctor", "name department")
      .sort({ paidAt: -1 })
      .lean();

    const toAmount = (value) => {
      const amount = Number(value);
      return Number.isFinite(amount) ? amount : 0;
    };

    const getDepartment = (appointment) =>
      appointment.doctor?.department || "Unassigned";

    const getMethod = (appointment) =>
      appointment.paymentMethod || "Other";

    // Summary
    const totalRevenue = paidAppointments.reduce(
      (total, appointment) =>
        total + toAmount(appointment.paymentAmount),
      0
    );

    const paidAppointmentCount = paidAppointments.length;

    // Department breakdown
    const departmentMap = {};

    paidAppointments.forEach((appointment) => {
      const department = getDepartment(appointment);

      if (!departmentMap[department]) {
        departmentMap[department] = {
          department,
          appointments: 0,
          revenue: 0,
        };
      }

      departmentMap[department].appointments += 1;
      departmentMap[department].revenue += toAmount(
        appointment.paymentAmount
      );
    });

    const departmentRevenue = Object.values(departmentMap).sort(
      (a, b) => b.revenue - a.revenue
    );

    // Payment-method breakdown
    const methodMap = {};

    paidAppointments.forEach((appointment) => {
      const method = getMethod(appointment);

      if (!methodMap[method]) {
        methodMap[method] = {
          method,
          appointments: 0,
          revenue: 0,
        };
      }

      methodMap[method].appointments += 1;
      methodMap[method].revenue += toAmount(
        appointment.paymentAmount
      );
    });

    const paymentMethodRevenue = Object.values(methodMap).sort(
      (a, b) => b.revenue - a.revenue
    );

    // Completed appointments that still have unpaid payments.
    // These are outstanding balances, NOT collected revenue.
    const pendingMatch = {
      status: "Completed",
      paymentStatus: "Pending",
    };

    const pendingAppointments = await Appointment.find(pendingMatch)
      .populate("patient", "name email phone")
      .populate("doctor", "name department")
      .sort({ date: -1 })
      .lean();

    const pendingPaymentAmount = pendingAppointments.reduce(
      (total, appointment) =>
        total + toAmount(
          appointment.paymentAmount || appointment.fee
        ),
      0
    );

    const pendingPayments = pendingAppointments.map((appointment) => ({
      id: appointment._id,
      patient: appointment.patient?.name || "Unknown Patient",
      patientEmail: appointment.patient?.email || "",
      doctor: appointment.doctor?.name || "Unknown Doctor",
      department: getDepartment(appointment),
      date: appointment.date,
      amount: toAmount(
        appointment.paymentAmount || appointment.fee
      ),
      paymentStatus: appointment.paymentStatus,
    }));

    // Detailed collected-revenue rows
    const transactions = paidAppointments.map((appointment) => ({
      id: appointment._id,
      patient: appointment.patient?.name || "Unknown Patient",
      patientEmail: appointment.patient?.email || "",
      doctor: appointment.doctor?.name || "Unknown Doctor",
      department: getDepartment(appointment),
      appointmentDate: appointment.date,
      paidAt: appointment.paidAt,
      amount: toAmount(appointment.paymentAmount),
      paymentMethod: getMethod(appointment),
      paymentStatus: appointment.paymentStatus,
      appointmentStatus: appointment.status,
      transactionID: appointment.transactionID || "",
    }));

    return res.status(200).json({
      success: true,
      filters: {
        startDate: startDate || null,
        endDate: endDate || null,
      },
      summary: {
        totalRevenue,
        paidAppointmentCount,
        pendingPaymentCount: pendingAppointments.length,
        pendingPaymentAmount,
      },
      departmentRevenue,
      paymentMethodRevenue,
      transactions,
      pendingPayments,
    });
  } catch (error) {
    console.error("Revenue report error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate revenue report.",
    });
  }
};
