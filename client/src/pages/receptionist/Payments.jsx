import { useEffect, useState } from "react";

import {
  FaUser,
  FaUserMd,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaQrcode,
  FaCreditCard,
  FaPaypal,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";

import {
  getPendingPayments,
  markPaymentAsPaid,
} from "../../services/receptionistPaymentService";
import PayPalPayment from "../../components/receptionist/PayPalPayment";
import CardPayment from "../../components/receptionist/CardPayment";
import "./Payments.css";
import QrPayment from "../../components/receptionist/QrPayment";
const Payments = () => {
  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedAppointment, setSelectedAppointment] =
    useState(null);

  const [selectedMethod, setSelectedMethod] =
    useState("");

  const [transactionId, setTransactionId] =
    useState("");

  const [processing, setProcessing] =
    useState(false);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getPendingPayments();

      if (response.success) {
        setAppointments(
          response.appointments || []
        );
      } else {
        setError(
          response.message ||
            "Failed to fetch payments."
        );
      }
    } catch (error) {
      console.error(
        "Fetch pending payments error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to fetch payments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  const openPayment = (appointment) => {
    setSelectedAppointment(appointment);
    setSelectedMethod("");
    setTransactionId("");
  };

  const closePayment = () => {
    if (processing) return;

    setSelectedAppointment(null);
    setSelectedMethod("");
    setTransactionId("");
  };

  const handleManualPayment = async () => {
    if (!selectedAppointment) return;

    if (!selectedMethod) {
      alert("Please select a payment method.");
      return;
    }

    if (
      selectedMethod === "QR" &&
      !transactionId.trim()
    ) {
      alert(
        "Please enter the payment transaction/reference ID."
      );

      return;
    }

    try {
      setProcessing(true);

      const response = await markPaymentAsPaid(
        selectedAppointment._id,
        {
          paymentMethod: selectedMethod,
          paymentTransactionId:
            transactionId.trim(),
          paymentAmount:
            Number(selectedAppointment.fee) || 0,
        }
      );

      if (response.success) {
        alert("Payment recorded successfully.");

        closePayment();

        fetchPayments();
      } else {
        alert(
          response.message ||
            "Payment failed."
        );
      }
    } catch (error) {
      console.error(
        "Payment error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to process payment."
      );
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="receptionist-payment-page">
        <div className="payment-loading">
          Loading payments...
        </div>
      </div>
    );
  }

  return (
    <div className="receptionist-payment-page">

      {/* HEADER */}
      <div className="payment-page-header">
        <div>
          <h1>Payments</h1>

          <p>
            Completed appointments waiting for payment
          </p>
        </div>

        <div className="payment-summary">
          <FaMoneyBillWave />

          <div>
            <span>Pending Payments</span>

            <strong>
              {appointments.length}
            </strong>
          </div>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="payment-error">
          {error}
        </div>
      )}

      {/* EMPTY */}

      {!error &&
        appointments.length === 0 && (
          <div className="payment-empty">
            <FaCheckCircle />

            <h3>
              No Pending Payments
            </h3>

            <p>
              All completed appointments have
              been paid.
            </p>
          </div>
        )}

      {/* PAYMENT LIST */}

      <div className="payment-list">

        {appointments.map((appointment) => (
          <div
            key={appointment._id}
            className="payment-card"
          >

            <div className="payment-patient">

              <div className="payment-avatar">
                <FaUser />
              </div>

              <div>
                <h3>
                  {appointment.patient?.name ||
                    "Unknown Patient"}
                </h3>

                <p>
                  {appointment.patient?.email ||
                    "No email"}
                </p>

                <p>
                  {appointment.patient?.phone ||
                    "No phone"}
                </p>
              </div>

            </div>

            <div className="payment-doctor">

              <span>
                <FaUserMd />
                Doctor
              </span>

              <strong>
                {appointment.doctor?.name ||
                  "N/A"}
              </strong>

              <small>
                {appointment.doctor?.department ||
                  ""}
              </small>

            </div>

            <div className="payment-date">

              <span>
                <FaCalendarAlt />
                Appointment
              </span>

              <strong>
                {formatDate(
                  appointment.date
                )}
              </strong>

              <small>
                {appointment.startTime} -{" "}
                {appointment.endTime}
              </small>

            </div>

            <div className="payment-fee">

              <span>
                Amount Due
              </span>

              <strong>
                $
                {Number(
                  appointment.fee || 0
                ).toFixed(2)}
              </strong>

              <small>
                Payment Pending
              </small>

            </div>

            <button
              type="button"
              className="payment-pay-btn"
              onClick={() =>
                openPayment(appointment)
              }
            >
              <FaMoneyBillWave />
              Pay
            </button>

          </div>
        ))}

      </div>

      {/* PAYMENT MODAL */}

      {selectedAppointment && (
        <div className="payment-modal-overlay">

          <div className="payment-modal">

            <button
              type="button"
              className="payment-modal-close"
              onClick={closePayment}
            >
              <FaTimes />
            </button>

            <div className="payment-modal-header">

              <h2>
                Complete Payment
              </h2>

              <p>
                {selectedAppointment.patient?.name}
              </p>

            </div>

            <div className="payment-amount-box">

              <span>
                Amount Due
              </span>

              <strong>
                $
                {Number(
                  selectedAppointment.fee || 0
                ).toFixed(2)}
              </strong>

            </div>

            {/* PAYMENT METHODS */}

            <div className="payment-method-title">
              Select Payment Method
            </div>

            <div className="payment-methods">

              <button
                type="button"
                className={
                  selectedMethod === "QR"
                    ? "payment-method active"
                    : "payment-method"
                }
                onClick={() =>
                  setSelectedMethod("QR")
                }
              >
                <FaQrcode />

                <span>
                  QR Scan
                </span>
              </button>

              <button
                type="button"
                className={
                  selectedMethod === "Card"
                    ? "payment-method active"
                    : "payment-method"
                }
                onClick={() =>
                  setSelectedMethod("Card")
                }
              >
                <FaCreditCard />

                <span>
                  Card
                </span>
              </button>

              <button
                type="button"
                className={
                  selectedMethod === "PayPal"
                    ? "payment-method active"
                    : "payment-method"
                }
                onClick={() =>
                  setSelectedMethod("PayPal")
                }
              >
                <FaPaypal />

                <span>
                  PayPal
                </span>
              </button>

            </div>

            {/* QR */}

            {selectedMethod === "QR" && (
              <div className="payment-option-box">

                <h3>
                  QR Code Payment
                </h3>

                <p>
                  The patient can scan the QR code
                  using their phone to pay the
                  appointment amount.
                </p>

                <QrPayment
                  appointmentId={
                    selectedAppointment._id
                  }
                />

              </div>
            )}

            {/* CARD */}

            {selectedMethod === "Card" && (
              <div className="payment-option-box">

                <h3>
                  Card Payment
                </h3>

                <p>
                  Enter the card details below.
                  The card fields are securely handled
                  by PayPal.
                </p>

                <CardPayment
                  appointmentId={
                    selectedAppointment._id
                  }
                  onSuccess={() => {
                    alert(
                      "Card payment completed successfully."
                    );

                    closePayment();
                    fetchPayments();
                  }}
                />

              </div>
            )}

            {/* PAYPAL */}

            {selectedMethod === "PayPal" && (
              <div className="payment-option-box">

                <h3>
                  Pay with PayPal
                </h3>

                <p>
                  Amount:
                  {" "}
                  $
                  {Number(
                    selectedAppointment.fee || 0
                  ).toFixed(2)}
                </p>

                <div style={{ marginTop: "20px" }}>
                  <PayPalPayment
                    appointmentId={
                      selectedAppointment._id
                    }
                    onSuccess={(data) => {
                      alert(
                        "PayPal payment completed successfully."
                      );

                      closePayment();
                      fetchPayments();
                    }}
                  />
                </div>

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};

export default Payments;