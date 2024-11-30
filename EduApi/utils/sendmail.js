const nodemailer = require("nodemailer");

const sendMail = async (email, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "andi.fab23@gmail.com",
      pass: "suxz kolc iorl doil",
    },
  });

  await transporter.sendMail({
    from: "Edu-Digital",
    to: email,
    subject: subject,
    html: text,
  });
};

module.exports = sendMail;
