import Appointment from "../models/appointment.js";

const PAYPAL_BASE =
  process.env.PAYPAL_ENVIRONMENT === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

// =====================================================
// GET PAYPAL ACCESS TOKEN
// =====================================================

const getPayPalAccessToken = async () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "PayPal credentials are not configured."
    );
  }

  const credentials = Buffer.from(
    `${clientId}:${clientSecret}`
  ).toString("base64");

  const response = await fetch(
    `${PAYPAL_BASE}/v1/oauth2/token`,
    {
      method: "POST",

      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type":
          "application/x-www-form-urlencoded",
      },

      body: "grant_type=client_credentials",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error(
      "PayPal token error:",
      data
    );

    throw new Error(
      data?.error_description ||
        "Failed to get PayPal access token."
    );
  }

  return data.access_token;
};

// =====================================================
// CREATE QR PAYMENT
// =====================================================

export const createPayPalQrPayment = async (
  req,
  res
) => {
  try {
    const { appointmentId } = req.body;

    console.log(
      "Creating QR payment for:",
      appointmentId
    );

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message:
          "Appointment ID is required.",
      });
    }

    const appointment =
      await Appointment.findById(appointmentId)
        .populate(
          "doctor",
          "name department"
        );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    if (appointment.status !== "Completed") {
      return res.status(400).json({
        success: false,
        message:
          "QR payment is only available for completed appointments.",
      });
    }

    if (appointment.paymentStatus === "Paid") {
      return res.status(400).json({
        success: false,
        message:
          "This appointment is already paid.",
      });
    }

    const amount = Number(
      appointment.fee || 0
    );

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid appointment fee.",
      });
    }

    // Reuse an existing link for this appointment
    if (appointment.paymentQrUrl) {
      return res.status(200).json({
        success: true,
        paymentLinkId:
          appointment.paymentQrLinkId || "",
        paymentUrl:
          appointment.paymentQrUrl,
        amount,
        currency:
          process.env.PAYPAL_CURRENCY || "USD",
        reused: true,
      });
    }

    const accessToken =
      await getPayPalAccessToken();

    const requestId =
      `appointment-${appointment._id.toString()}-${Date.now()}`;

    // Keep the PayPal request minimal.
    // PayPal documents LINK + BUY_NOW + MULTIPLE
    // with a line item containing name + unit_amount.
    const paymentResource = {
  integration_mode: "LINK",
  type: "BUY_NOW",
  reusable: "MULTIPLE",

  line_items: [
    {
      name: "Medicare Hospital Appointment",

      unit_amount: {
        currency_code:
          process.env.PAYPAL_CURRENCY || "USD",

        value: amount.toFixed(2),
      },
    },
  ],
};

    console.log(
      "PayPal QR request:",
      JSON.stringify(
        paymentResource,
        null,
        2
      )
    );

    const response = await fetch(
      `${PAYPAL_BASE}/v1/checkout/payment-resources`,
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${accessToken}`,

          Accept:
            "application/json",

          "Content-Type":
            "application/json",

          "PayPal-Request-Id":
            requestId,
        },

        body: JSON.stringify(
          paymentResource
        ),
      }
    );

    const data =
      await response.json();

    console.log(
      "PayPal QR response:",
      JSON.stringify(
        data,
        null,
        2
      )
    );

    if (!response.ok) {
      return res.status(
        response.status
      ).json({
        success: false,

        message:
          data?.message ||
          "PayPal rejected the payment link.",

        paypalError: data,
      });
    }

    const paymentUrl =
      data?.payment_link ||
      data?.links?.find(
        (link) =>
          link.rel === "payment_link"
      )?.href;

    if (!paymentUrl) {
      return res.status(500).json({
        success: false,
        message:
          "PayPal did not return a payment link.",
        paypalResponse: data,
      });
    }

    appointment.paymentQrLinkId =
      data.id || "";

    appointment.paymentQrUrl =
      paymentUrl;

    await appointment.save();

    return res.status(201).json({
      success: true,

      paymentLinkId:
        data.id || "",

      paymentUrl,

      amount,

      currency:
        process.env.PAYPAL_CURRENCY ||
        "USD",
    });
  } catch (error) {
    console.error(
      "Create PayPal QR payment error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create QR payment.",
      error: error.message,
    });
  }
};
