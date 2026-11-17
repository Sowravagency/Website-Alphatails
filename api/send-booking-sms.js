
const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

module.exports = async function handler(req, res) {

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  try {

    const {
      customerName,
      phone,
      service,
      bookingDate,
      bookingTime,
      bookingId
    } = req.body || {};

    // Validate required fields
    if (
      !customerName ||
      !phone ||
      !service ||
      !bookingDate ||
      !bookingTime ||
      !bookingId
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing booking information"
      });
    }

    // Validate Indian mobile number
    const cleanPhone = String(phone).replace(/[\s-]/g, "");

    if (!/^\+91[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Indian mobile number"
      });
    }

    // Limit message size and sanitize user-provided text
    const cleanName = String(customerName)
      .replace(/[<>]/g, "")
      .trim()
      .slice(0, 50);

    const cleanService = String(service)
      .replace(/[<>]/g, "")
      .trim()
      .slice(0, 70);

    if (!cleanName || !cleanService) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking information"
      });
    }

    const message =
      `Hello ${cleanName}, your booking is confirmed!\n\n` +
      `Service: ${cleanService}\n` +
      `Date: ${bookingDate}\n` +
      `Time: ${bookingTime}\n` +
      `Booking ID: ${String(bookingId).slice(0, 40)}\n\n` +
      `Thank you for choosing us!`;

    // Send SMS using Twilio
    const sms = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: cleanPhone
    });

    return res.status(200).json({
      success: true,
      message: "Booking confirmation SMS submitted",
      messageSid: sms.sid
    });

  } catch (error) {

    console.error("Twilio SMS error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to send confirmation SMS"
    });

  }
};
