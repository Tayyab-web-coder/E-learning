const express = require('express');
const sendEmail = require('./sendEmail'); // Your SendGrid email sending function
const app = express();

app.use(express.json());

app.post('/send-email', (req, res) => {
  const { recipientEmail, subject, message } = req.body;

  sendEmail(recipientEmail, subject, message)
    .then(() => res.status(200).json({ message: 'Email sent successfully' }))
    .catch(error => res.status(500).json({ error: 'Failed to send email' }));
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
