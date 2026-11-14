import {
  PayPalProvider,
  PayPalOneTimePaymentButton,
} from "@paypal/react-paypal-js/sdk-v6";

const PayPalPayment = ({
  appointmentId,
  onSuccess,
}) => {
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
          "Failed to create PayPal order."
      );
    }

    return {
      orderId: data.orderId,
    };
  };

  const captureOrder = async ({
    orderId,
  }) => {
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
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message ||
          "Failed to capture PayPal payment."
      );
    }

    onSuccess?.(data);
  };

  
  return (
    <PayPalProvider
      clientId={import.meta.env.VITE_PAYPAL_CLIENT_ID}
      environment={
        import.meta.env.VITE_PAYPAL_ENVIRONMENT ||
        "sandbox"
      }
      components={["paypal-payments"]}
      pageType="checkout"
    >
      <PayPalOneTimePaymentButton
        createOrder={createOrder}
        onApprove={captureOrder}
        presentationMode="auto"
      />
    </PayPalProvider>
  );
};

export default PayPalPayment;