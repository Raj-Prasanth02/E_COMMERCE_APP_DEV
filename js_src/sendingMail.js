const nodemailer = require('nodemailer');
require('dotenv').config();

const email = process.env.user;
const password = process.env.password;
const service = process.env.service;

const transporter = nodemailer.createTransport({ //GSMTP - Google - Simple Mail Transport Protocol
  service: service,
  auth: {
    user: email,
    pass: password //This is application password, this will authenticate only for application transport Emails. Not for human use.
  }
});

function sendEmail(recipientEmail,resetLink, firstName) {
  //const domain = recipientEmail.split('@')[1]; // extract domain from recipient email
  //const fromEmail = `noreply@${domain}`; // create from email address using extracted domain
  const mailOptions = {
    from: 'HappyCart - Love Shopping!! <noreply@happycart.com>', //<> This symbol is mandotory to hide the original Email address to receiver.
    to: recipientEmail,
    subject: 'Password Reset',
    html: 
    `<div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1>Password Reset Request</h1>
      <h3>Hi ${firstName} !</h3>
      <p>We have received a password reset request for your account. If you did not make this request, you can safely ignore this email.</p>
      <p>To reset your password, please click on the following link:</p>
      <p><a href="${resetLink}"> Reset Link </a></p>
      <p>If the above link does not work, please copy and paste the following URL into your web browser:</p>
      <p>${resetLink}</p>
      <p>This password reset link is valid for the next 5 minutes!! </p>
      <p>If you have any questions or concerns, please do not hesitate to contact us at rajravi0212@gmail.com.</p>
      <p>Thank you!</p>
    </div>`
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error); 
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}


module.exports = sendEmail;

