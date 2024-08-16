const sgMail = require('@sendgrid/mail');

// Replace with your SendGrid API key
sgMail.setApiKey('YOUR_SENDGRID_API_KEY');

function sendEmail(to, subject, text) {
  const msg = {
    to, // recipient email
    from: 'your-email@example.com', // your verified sender email
    subject,
    text,
  };

  return sgMail.send(msg);
}

module.exports = sendEmail;
