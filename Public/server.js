require('dotenv').config();
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
app.use(express.json());
app.use(cors()); // Allows your HTML frontend to communicate with this backend

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// API Endpoint called when booking is submitted
app.post('/api/book-appointment', async (req, res) => {
    const { patientName, patientPhone, appointmentDate, serviceName } = req.body;

    try {
        const message = await client.messages.create({
            body: `Hello ${patientName}, your appointment for ${serviceName} at AlphaTails is confirmed for ${appointmentDate}. We look forward to seeing you!`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: patientPhone // Must include country code, e.g., +919876543210
        });

        console.log(`SMS sent successfully: ${message.sid}`);
        res.status(200).json({ success: true, messageId: message.sid });
    } catch (error) {
        console.error('Twilio error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
