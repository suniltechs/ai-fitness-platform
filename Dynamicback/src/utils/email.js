const sgMail = require("@sendgrid/mail");

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

/**
 * Send an email using SendGrid.
 * Fails gracefully — logs error but does not throw.
 *
 * @param {{ to: string, subject: string, html: string }} options
 */
const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn("⚠️  SENDGRID_API_KEY not set. Email not sent.");
    return;
  }

  try {
    await sgMail.send({
      to,
      from: process.env.SENDGRID_FROM_EMAIL || "noreply@gym.com",
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Email send failed: ${error.message}`);
  }
};

module.exports = sendEmail;
