// scripts/check-mailer.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: process.env.MAILER_SERVICE,
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_SECRET_KEY,
  },
});

transporter.verify((err, success) => {
  if (err) {
    console.error('Transporter verify failed:', err);
    process.exit(1);
  } else {
    console.log('Transporter ok:', success);
    process.exit(0);
  }
});