const dotEnv = require("dotenv");
dotEnv.config();

const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const nodemailer = require("nodemailer");



/* TRANSPORTERS */

const transporter1 = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  connectionTimeout: 20000,
  greetingTimeout: 15000,
  socketTimeout: 20000,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const transporter2 = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  connectionTimeout: 20000,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const transporter3 = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/* ARRAY OF TRANSPORTERS */

const transporters = [
  { name: "SMTP 465 SSL", transporter: transporter1 },
  { name: "SMTP 587 TLS", transporter: transporter2 },
  { name: "GMAIL SERVICE", transporter: transporter3 },
];



/* SEND MAIL FUNCTION */

const sendMail = async ({ to, subject, text }) => {

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