const PAYPAL_BASE =
  process.env.PAYPAL_ENVIRONMENT === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

export const getPayPalBrowserSafeClientToken = async (
  req,
  res
) => {
  try {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret =
      process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(500).json({
        success: false,
        message: "PayPal credentials are not configured.",
      });
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
        body:
          "grant_type=client_credentials&response_type=client_token&intent=sdk_init",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "PayPal client token error:",
        data
      );

      return res.status(500).json({
        success: false,
        message:
          data?.error_description ||
          "Failed to create PayPal client token.",
      });
    }

    return res.status(200).json({
      success: true,
      accessToken: data.access_token,
    });
  } catch (error) {
    console.error(
      "PayPal browser-safe client token error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create PayPal browser-safe client token.",
      error: error.message,
    });
  }
};