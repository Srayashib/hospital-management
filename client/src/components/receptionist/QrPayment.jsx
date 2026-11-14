import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { FaQrcode } from "react-icons/fa";

const QrPayment = ({
  appointmentId,
}) => {
  const [paymentUrl, setPaymentUrl] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const createQrPayment = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/paypal/create-qr-payment",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            appointmentId,
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to create QR payment."
        );
      }

      setPaymentUrl(
        data.paymentUrl
      );
    } catch (error) {
      console.error(
        "QR payment error:",
        error
      );

      setError(
        error.message ||
          "Failed to create QR payment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="qr-payment-container">

      {!paymentUrl && (
        <>
          <div className="qr-payment-icon">
            <FaQrcode />
          </div>

          <h3>
            QR Code Payment
          </h3>

          <p>
            Generate a secure PayPal QR code
            for this appointment.
          </p>

          <button
            type="button"
            className="confirm-payment-btn"
            onClick={createQrPayment}
            disabled={loading}
          >
            {loading
              ? "Creating QR..."
              : "Generate Payment QR"}
          </button>
        </>
      )}

      {error && (
        <div className="card-payment-message error">
          {error}
        </div>
      )}

      {paymentUrl && (
        <div className="qr-payment-result">

          <div className="qr-code-wrapper">
            <QRCodeCanvas
              value={paymentUrl}
              size={220}
              level="M"
              includeMargin
            />
          </div>

          <h3>
            Scan to Pay
          </h3>

          <p>
            Ask the patient to scan this
            QR code with their phone.
          </p>

          <a
            href={paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="qr-open-link"
          >
            Open Payment Page
          </a>

        </div>
      )}

    </div>
  );
};

export default QrPayment;