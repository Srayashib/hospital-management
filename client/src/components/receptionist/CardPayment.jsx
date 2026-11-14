import { useEffect, useState ,useRef} from "react";

import {
  PayPalProvider,
  PayPalCardFieldsProvider,
  PayPalCardNameField,
  PayPalCardNumberField,
  PayPalCardExpiryField,
  PayPalCardCvvField,
  usePayPalCardFieldsOneTimePaymentSession,
} from "@paypal/react-paypal-js/sdk-v6";

const CardPaymentForm = ({
  appointmentId,
  onSuccess,
}) => {
  const {
  submit,
  submitResponse,
  error: cardSessionError,
} =
  usePayPalCardFieldsOneTimePaymentSession();

  const [processing, setProcessing] = useState(false);

  const [paymentStatus, setPaymentStatus] =
    useState("idle");

  const [message, setMessage] = useState("");

  const [transactionId, setTransactionId] =
    useState("");

  // =====================================================
  // CREATE PAYPAL ORDER
  // =====================================================

  const createOrder = async () => {
    const token =
      localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:5000/api/paypal/create-order",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          appointmentId,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message ||
          "Failed to create payment order."
      );
    }

    return data.orderId;
  };

  // =====================================================
  // CAPTURE ORDER
  // =====================================================

  const captureOrder = async (
    orderId,
    paymentMethod = "Card"
    ) => {
    const token =
        localStorage.getItem("token");

    const response = await fetch(
        "http://localhost:5000/api/paypal/capture-order",
        {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
            appointmentId,
            orderId,
            paymentMethod,
        }),
        }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(
        data.message ||
            "Payment capture failed."
        );
    }

    return data;
    };

  // =====================================================
  // PAY
  // =====================================================

  const pendingOrderIdRef = useRef(null);

    const handlePay = async () => {
    if (processing) return;

    try {
        setProcessing(true);
        setPaymentStatus("processing");
        setMessage("Processing card payment...");

        // 1. Create order on backend
        const orderId = await createOrder();

        // Save the order ID because submit() does not return
        // the submitResponse object directly in SDK v6.
        pendingOrderIdRef.current = orderId;

        // 2. Submit PayPal Card Fields
        await submit(orderId, {
        billingAddress: {
            countryCode: "US",
        },
        });

        // DO NOT inspect the return value of submit().
        // PayPal updates submitResponse asynchronously.
    } catch (error) {
        console.error(
        "Card payment submission error:",
        error
        );

        setPaymentStatus("failed");
        setMessage(
        error.message ||
            "Card payment failed."
        );
        setProcessing(false);
    }
    };

    useEffect(() => {
  if (!submitResponse) {
    return;
  }

  console.log(
    "PayPal card submission response:",
    submitResponse
  );

  const {
    state,
    data,
  } = submitResponse;

  if (state === "failed") {
    setPaymentStatus("failed");

    setMessage(
      data?.message ||
        "Card validation or payment failed."
    );

    setProcessing(false);
    return;
  }

  if (state === "canceled") {
    setPaymentStatus("failed");

    setMessage(
      "Card authentication was cancelled."
    );

    setProcessing(false);
    return;
  }

  if (state !== "succeeded") {
    setPaymentStatus("failed");

    setMessage(
      "Payment could not be completed."
    );

    setProcessing(false);
    return;
  }

  // ==========================================
  // CARD SUBMISSION SUCCEEDED
  // NOW CAPTURE ON YOUR BACKEND
  // ==========================================

  const orderId =
    data?.orderId ||
    pendingOrderIdRef.current;

  if (!orderId) {
    setPaymentStatus("failed");
    setMessage(
      "PayPal order ID is missing."
    );
    setProcessing(false);
    return;
  }

  const completeCapture = async () => {
    try {
      const payment =
        await captureOrder(
          orderId,
          "Card"
        );

      // ONLY AFTER CAPTURE SUCCESS
      setPaymentStatus("success");

      setTransactionId(
        payment?.paypal?.captureId ||
          payment?.appointment
            ?.paymentTransactionId ||
          ""
      );

      setMessage(
        "Payment successful!"
      );

      pendingOrderIdRef.current = null;

      setTimeout(() => {
        onSuccess?.(payment);
      }, 1500);
    } catch (error) {
      console.error(
        "Card capture error:",
        error
      );

      setPaymentStatus("failed");

      setMessage(
        error.message ||
          "Payment capture failed."
      );
    } finally {
      setProcessing(false);
    }
  };

  completeCapture();
}, [submitResponse]);
useEffect(() => {
  if (!cardSessionError) {
    return;
  }

  console.error(
    "PayPal Card Fields error:",
    cardSessionError
  );

  setPaymentStatus("failed");

  setMessage(
    cardSessionError.message ||
      "Unable to process card payment."
  );

  setProcessing(false);
}, [cardSessionError]);

  // =====================================================
  // SUCCESS SCREEN
  // =====================================================

  if (paymentStatus === "success") {
    return (
      <div className="card-payment-success">

        <div className="card-success-icon">
          ✓
        </div>

        <h3>
          Payment Successful
        </h3>

        <p>
          The card payment has been completed
          successfully.
        </p>

        {transactionId && (
          <small>
            Transaction ID: {transactionId}
          </small>
        )}

      </div>
    );
  }

  return (
    <div className="card-payment-form">

      {/* CARDHOLDER */}

      <div className="card-field-group">
        <label>
          Cardholder Name
        </label>

        <PayPalCardNameField
          placeholder="Name on card"
          containerStyles={{
            height: "48px",
          }}
        />
      </div>

      {/* CARD NUMBER */}

      <div className="card-field-group">
        <label>
          Card Number
        </label>

        <PayPalCardNumberField
          placeholder="Card number"
          containerStyles={{
            height: "48px",
          }}
        />
      </div>

      {/* EXPIRY + CVV */}

      <div className="card-fields-row">

        <div className="card-field-group">
          <label>
            Expiry
          </label>

          <PayPalCardExpiryField
            placeholder="MM/YY"
            containerStyles={{
              height: "48px",
            }}
          />
        </div>

        <div className="card-field-group">
          <label>
            CVV
          </label>

          <PayPalCardCvvField
            placeholder="CVV"
            containerStyles={{
              height: "48px",
            }}
          />
        </div>

      </div>

      {/* STATUS */}

      {message && (
        <div
          className={
            paymentStatus === "failed"
              ? "card-payment-message error"
              : "card-payment-message"
          }
        >
          {message}
        </div>
      )}

      {/* PAY BUTTON */}

      <button
        type="button"
        className="provider-payment-btn"
        onClick={handlePay}
        disabled={processing}
      >
        <span>
          💳
        </span>

        {processing
          ? "Processing Card..."
          : "Pay with Card"}
      </button>

    </div>
  );
};

// =====================================================
// MAIN COMPONENT
// =====================================================

const CardPayment = ({
  appointmentId,
  onSuccess,
}) => {
  const [clientToken, setClientToken] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadClientToken =
      async () => {
        try {
          const token =
            localStorage.getItem("token");

          const response = await fetch(
            "http://localhost:5000/api/paypal/browser-safe-client-token",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
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
                "Failed to initialize card payment."
            );
          }

          setClientToken(
            data.accessToken
          );
        } catch (error) {
          console.error(
            "Card payment initialization error:",
            error
          );

          setError(
            error.message ||
              "Unable to initialize card payment."
          );
        } finally {
          setLoading(false);
        }
      };

    loadClientToken();
  }, []);

  if (loading) {
    return (
      <div className="card-loading">
        Loading secure card fields...
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-payment-message error">
        {error}
      </div>
    );
  }

  return (
    <PayPalProvider
      clientToken={clientToken}
      environment="sandbox"
      components={["card-fields"]}
      pageType="checkout"
    >
      <PayPalCardFieldsProvider>
        <CardPaymentForm
          appointmentId={appointmentId}
          onSuccess={onSuccess}
        />
      </PayPalCardFieldsProvider>
    </PayPalProvider>
  );
};

export default CardPayment;