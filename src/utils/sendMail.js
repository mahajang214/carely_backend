const dotEnv = require("dotenv");
dotEnv.config();

const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const nodemailer = require("nodemailer");



/* TRANSPORTERS */

const transporter1 = nodemailer.createTransport({
  host: "74.125.69.109", // Gmail IPv4
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const transporter2 = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
  tls: {
    rejectUnauthorized: false,
    family: 4
  },
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const transporter3 = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/* ARRAY OF TRANSPORTERS */
const transporters = [
  { name: "Gmail IPv4 Direct", transporter: transporter1 },
  { name: "SMTP 465 Gmail TLS", transporter: transporter2 },
  { name: "SMTP 587 TLS", transporter: transporter3 },
];



/* SEND MAIL FUNCTION */

const sendMail = async ({ to, subject, text }) => {
  console.log("Sending mail to:", to);
  for (const t of transporters) {
    try {
      console.log(`Trying transporter: ${t.name}`);

      const info = await t.transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        text,
      });

      console.log(`SUCCESS with ${t.name}`);

      return {
        success: true,
        transporter: t.name,
        messageId: info.messageId,
      };

    } catch (error) {
      console.log(`FAILED with ${t.name}`);
      console.log(error.message);
    }
  }

  return {
    success: false,
    error: "All SMTP transporters failed",
  };
};

module.exports = sendMail;