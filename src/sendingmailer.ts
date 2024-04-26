const path = require("path");
const nodemailer = require('nodemailer')
const dotenv = require("dotenv");
dotenv.config({
  path: path.resolve(__dirname, '../.env'),
})

/*
export{}
*/
// Load MailerSend SMTP settings from environment variables or configuration
const mailOptions = {
  host: 'smtp.mailersend.net', // MailerSend SMTP server
  port: 587, // MailerSend SMTP port
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAILERSEND_USER,
    pass: process.env.MAILERSEND_PASS,
  },
};

// Create a transporter object using the SMTP settings
const transporter = nodemailer.createTransport(mailOptions);

// Define the email options
const emailOptions = {
  from: 'support@thenesquikoutlet.co.za',
  to: 'derman.matthew@gmail.com',
  subject: 'Test Email',
  text: 'This is a test email sent using Nodemailer and MailerSend.',
};

// Send the email
transporter.sendMail(emailOptions, (error, info) => {
  if (error) {
    console.log('Error sending email:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});
