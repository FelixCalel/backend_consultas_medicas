const nodemailer = require('nodemailer');
require('dotenv').config();

const service = process.env.MAILER_SERVICE || 'Gmail';
const user = process.env.MAILER_EMAIL;
const pass = process.env.MAILER_SECRET_KEY;

console.log('Checking mailer with: ', { service, user: user ? '***' : undefined, pass: pass ? '***' : undefined });

const transporter = nodemailer.createTransport({
  service,
  auth: {
    user,
    pass,
  },
});

transporter.verify((err, success) => {
  if (err) {
    console.error('Transporter verify failed:');
    console.error(err);
    process.exit(1);
  } else {
    console.log('Transporter ok:', success);
    process.exit(0);
  }
});
