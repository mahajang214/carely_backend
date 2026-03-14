const dotEnv = require("dotenv");
dotEnv.config();

const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

/* SEND MAIL FUNCTION */

const sendMail = async ({ to, subject, text, html }) => {
  try {
    const response = await resend.emails.send({
      from: process.env.MAIL_FROM,
      to,
      subject,
      text,
      html, // optional but useful
    });

    console.log("Email sent successfully:", response)
    return {
      success: true,
      messageId: response.data?.id,
    };

  } catch (error) {
    console.error("Mail error:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = sendMail;