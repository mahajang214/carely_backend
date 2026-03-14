const dotEnv = require("dotenv");
dotEnv.config();
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first"); // force Node to prefer IPv4

const nodemailer = require("nodemailer");

// console.log("MAIL_HOST:", process.env.MAIL_HOST);
// console.log("MAIL_PORT:", process.env.MAIL_PORT);

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.MAIL_PORT) || 587,
  secure: false, // true only for port 465
  family: 4, // also force IPv4
  connectionTimeout: 20000,
  greetingTimeout: 15000,
  socketTimeout: 20000,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASS
//   }
// });

transporter.verify(function (error, success) {
  if (error) {
    console.log("SMTP ERROR:", error);
  } else {
    console.log("SMTP Server is ready");
  }
});

const sendMail = async ({ to, subject, text }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject,
      text,
    });

    return {
      success: true,
      messageId: info.messageId,
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