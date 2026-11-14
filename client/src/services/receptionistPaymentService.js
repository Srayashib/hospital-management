import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/receptionist/payments",
});

// =====================================================
// GET PENDING PAYMENTS
// =====================================================

export const getPendingPayments = async () => {
  const token = localStorage.getItem("token");

  const response = await API.get("/pending", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// =====================================================
// MARK PAYMENT PAID
// =====================================================

export const markPaymentAsPaid = async (
  appointmentId,
  paymentData
) => {
  const token = localStorage.getItem("token");

  const response = await API.put(
    `/${appointmentId}/pay`,
    paymentData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};