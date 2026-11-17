require('dotenv').config();
const express = require('express');
const twilio = require('twilio');

const app = express();
app.use(express.json());
// Serve your frontend HTML file if hosted together
app.use(express.static('public')); 

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// API endpoint that your website frontend will call when a booking happens
app.post('/api/book-appointment', async (req, res) => {
    const { patientName, patientPhone, appointmentDate } = req.body;

    try {
        // Send SMS via Twilio
        const message = await client.messages.create({
            body: `Hello ${patientName}, your appointment at our clinic is confirmed for ${appointmentDate}. We look forward to seeing you!`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: patientPhone // Must be in E.164 format, e.g., +919876543210
        });

        console.log(`Message sent successfully: ${message.sid}`);
        res.status(200).json({ success: true, messageId: message.sid });
    } catch (error) {
        console.error('Twilio error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
